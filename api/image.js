import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "HF Error", detail: data.error });
    }

    // HF sekarang biasanya mengembalikan URL gambar
    const imageUrl = data[0]?.url || data[0]?.generated_image;

    if (!imageUrl) {
      return res.status(500).json({ error: "HF Error", detail: "Image not found" });
    }

    res.status(200).json({ image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
