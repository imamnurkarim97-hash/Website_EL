import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt kosong" });
    }

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const contentType = hfRes.headers.get("content-type");

    // ⏳ MODEL LOADING
    if (contentType && contentType.includes("application/json")) {
      const json = await hfRes.json();
      return res.status(202).json({
        loading: true,
        message: json.error || "Model loading",
      });
    }

    const buffer = Buffer.from(await hfRes.arrayBuffer());
    const base64 = buffer.toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64}`,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
