import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(
      "https://api.groq.com/openai/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          size: "1024x1024" // ukuran gambar
        }),
      }
    );

    const data = await response.json();

    if (!data.data || !data.data[0]?.url) {
      return res.status(500).json({ error: "Invalid response from AI", detail: data });
    }

    res.status(200).json({ imageUrl: data.data[0].url });

  } catch (error) {
    res.status(500).json({ error: "Server error", detail: error.message });
  }
}
