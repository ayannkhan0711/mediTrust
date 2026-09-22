import { GoogleGenAI } from "@google/genai";
import { response } from "express";
import fs from "node:fs"
import uploadToCloudianry from "../../middleware/cloudinaryMiddleware.js"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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

const explainPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log(req.file);

    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { text: EXTRACTION_PROMPT },
        imagePart,
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = result.text;

    const image = await uploadToCloudianry(req.file.path)

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    }

    res.status(200).json({
      data: parsed,
      image: image.secure_url
    });

  } catch (err) {
    console.error("Gemini extraction failed:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, error: "Extraction failed", details: err.message });
  }
}

const aiController = {
  explainPrescription
}

export default aiController