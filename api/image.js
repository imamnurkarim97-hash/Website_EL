import fetch from "node-fetch";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form error" });
    }

    const prompt = fields.prompt;
    const imageFile = files.image;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt kosong" });
    }

    try {
      let body;

      // ===== TEXT → IMAGE =====
      if (!imageFile) {
        body = JSON.stringify({ inputs: prompt });
      }

      // ===== IMAGE → IMAGE =====
      if (imageFile) {
        const imgBuffer = fs.readFileSync(imageFile.filepath);
        body = imgBuffer;
      }

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            ...(imageFile ? {} : { "Content-Type": "application/json" })
          },
          body
        }
      );

      if (!response.ok) {
        const txt = await response.text();
        return res.status(500).json({ error: txt });
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
