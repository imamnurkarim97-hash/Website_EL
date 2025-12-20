import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch("https://router.huggingface.co/models/stabilityai/stable-diffusion-2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "HF Error", detail: data.error });
    }

    // HF Router API biasanya mengembalikan array dengan URL gambar
    const imageUrl = data[0]?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: "HF Error", detail: "Image not found" });
    }

    res.status(200).json({ image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
