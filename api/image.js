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
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "HF Error", detail: data.error });
    }

    // HF Router terkini mengembalikan array dengan base64
    const image_base64 = data[0].image_base64 || data[0].generated_image;

    if (!image_base64) {
      return res.status(500).json({ error: "HF did not return image" });
    }

    res.status(200).json({ image: image_base64 });

  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
