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

    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

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
      parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
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

    res.status(200).json({ prescription });
  } catch (err) {
    console.error("Gemini extraction failed:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({
        success: false,
        error: "Extraction failed",
        details: err.message,
      });
  }
};

const findMedicines = async (req, res) => {

  const pid = req.params.pid



  const products = await Product.find();

  const pathologists = await Pathologist.find();

 const prescription = await Prescription.findById(pid);

if (!prescription) {
  return res.status(404).json({
    message: "Prescription not found",
  });
}

res.json({
  products,
  pathologists,
  medicines: prescription.medicines,
});


  res.json({ products, pathologists , medicines : prescription.medicines });
};

const aiController = {
  explainPrescription,
  findMedicines,
};

export default aiController;
