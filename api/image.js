import fetch from "node-fetch";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form error" });

    const prompt = fields.prompt;
    if (!prompt) return res.status(400).json({ error: "Prompt kosong" });

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt })
        }
      );

      const contentType = response.headers.get("content-type");

      // ❗ HANDLE MODEL LOADING
      if (contentType.includes("application/json")) {
        const json = await response.json();
        return res.status(202).json({
          loading: true,
          message: json.error || "Model loading"
        });
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      res.status(200).json({
        image: `data:image/png;base64,${base64}`
      });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
