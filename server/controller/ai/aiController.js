import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import uploadToCloudianry from "../../middleware/cloudinaryMiddleware.js";
import Prescription from "../../models/prescriptionModel.js";
import Pathologist from "../../models/pathologistModel.js";
import Product from "../../models/productModel.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const EXTRACTION_PROMPT = `
You are reading a photo of a doctor's handwritten or printed prescription.
Extract the details and respond with ONLY valid JSON (no markdown fences, no commentary):

{
  "patient_name": string | null,
  "doctor_name": string | null,
  "date": string | null,
  "medicines": [
    {
      "name": string,
      "dosage": string | null,
      "frequency": string | null,
      "duration": string | null,
      "instructions": string | null,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "notes": string | null
}

Rules:
- If handwriting is unclear, guess the name but mark "confidence": "low".
- If a field can't be determined, use null.
- Don't invent medicines not visibly written.
- "medicines" must be an array even if empty.
`;

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
}

async function generateWithRetry(contents, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
        contents,
        config: { responseMimeType: "application/json" },
      });
    } catch (err) {
      const isRetryable = err.status === 503 || err.status === 429;

      if (!isRetryable || attempt === maxRetries) throw err;

      const delay = attempt * 1000;

      console.warn(
        `Gemini ${err.status}, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`,
      );

      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

const explainPrescription = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log(req.file);

    const imagePart = fileToGenerativePart(
      req.file.path,
      req.file.mimetype,
    );

    const result = await generateWithRetry([
      { text: EXTRACTION_PROMPT },
      imagePart,
    ]);

    const rawText = result.text;

    const image = await uploadToCloudianry(req.file.path);

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = JSON.parse(
        rawText.replace(/```json|```/g, "").trim(),
      );
    }

    const prescription = new Prescription({
      user: userId,
      patient_name: parsed.patient_name,
      doctor_name: parsed.doctor_name,
      date: parsed.date,
      medicines: parsed.medicines,
      notes: parsed.notes,
      image: image.secure_url,
    });

    await prescription.save();
    await prescription.populate("user");

    return res.status(200).json({ prescription });

  } catch (err) {
    console.error("Gemini extraction failed:", err);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      error: "Extraction failed",
      details: err.message,
    });
  }
};

const findMedicines = async (req, res) => {
  const pid = req.params.pid;

  try {
    const products = await Product.find();

    const pathologists = await Pathologist.find();

    const prescription = await Prescription.findById(pid);

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    const MEDICINE_FOUNDER_PROMPT = `
You are a healthcare inventory matching assistant.

Your task is to analyze prescription data and compare the prescribed medicines and medical tests with the available pharmacy and laboratory inventory.

IMPORTANT RULES:

1. Match each prescribed medicine with the available medicine/product by name.
2. Consider reasonable variations such as brand name, generic name, capitalization, and minor spelling differences.
3. Do NOT assume two medicines are the same only because they have a similar purpose.
4. If you are not confident that a medicine is the same, mark it as "not_available".
5. A medicine is "available" only when a confident match exists AND stock is greater than 0.
6. Match each prescribed medical test with the available laboratory/test data.
7. A test is "available" only when a confident match exists and the test is currently available.
8. Do NOT recommend alternative medicines.
9. Do NOT change or modify the prescribed dosage, frequency, duration, or instructions.
10. Do NOT provide medical advice or diagnosis.
11. Do NOT invent medicines, tests, prices, stock, IDs, or any other information.
12. If a prescribed medicine or test cannot be found, mark it as "not_available".
13. Preserve the prescription information exactly as provided.
14. Return ONLY valid JSON. Do not return markdown, explanations, or extra text.

RETURN EXACTLY THIS JSON STRUCTURE:

{
  "status": "success",
  "medicines": {
    "available": [
      {
        "prescribedName": "string",
        "matchedProductName": "string",
        "productId": "string",
        "dosage": "string or null",
        "frequency": "string or null",
        "duration": "string or null",
        "instructions": "string or null",
        "stock": 0,
        "price": 0
      }
    ],
    "notAvailable": [
      {
        "prescribedName": "string",
        "dosage": "string or null",
        "frequency": "string or null",
        "duration": "string or null",
        "instructions": "string or null",
        "reason": "Medicine not found in available inventory"
      }
    ]
  },
  "tests": {
    "available": [
      {
        "testName": "string",
        "matchedTestName": "string",
        "testId": "string or null",
        "price": 0
      }
    ],
    "notAvailable": [
      {
        "testName": "string",
        "reason": "Test not available"
      }
    ]
  },
  "summary": {
    "totalMedicines": 0,
    "availableMedicines": 0,
    "unavailableMedicines": 0,
    "totalTests": 0,
    "availableTests": 0,
    "unavailableTests": 0
  }
}

ADDITIONAL RULES:

- If there are no prescribed tests, return an empty array for tests.
- If there are no prescribed medicines, return empty medicine arrays.
- If there are no available tests, mark all requested tests as "not_available".
- If stock is 0 or less, the medicine must be "not_available".
- Never use a similar medicine as a substitute.
- Never create missing inventory data.
- Keep all numeric values as numbers, not strings.
- Always return valid JSON that can be directly parsed using JSON.parse().

PRESCRIPTION DATA:
${JSON.stringify(prescription)}

AVAILABLE MEDICINES:
${JSON.stringify(products)}

AVAILABLE TESTS:
${JSON.stringify(pathologists)}
`;

    const response = await generateWithRetry([
      { text: MEDICINE_FOUNDER_PROMPT },
    ]);

    const rawText = response.text;

    let result;

    try {
      result = JSON.parse(rawText);
    } catch {
      result = JSON.parse(
        rawText.replace(/```json|```/g, "").trim(),
      );
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("Error In Getting Data From Server:", error);

    return res.status(500).json({
      success: false,
      message: "Error In Getting Data From Server",
      error: error.message,
    });
  }
};

const aiController = {
  explainPrescription,
  findMedicines,
};

export default aiController;