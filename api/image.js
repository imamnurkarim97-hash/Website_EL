export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({
        error: "HF Error",
        detail: err,
      });
    }

    const imageBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "image/png");
    return res.status(200).send(Buffer.from(imageBuffer));

  } catch (e) {
    return res.status(500).json({
      error: "Server error",
      detail: e.message,
    });
  }
}
