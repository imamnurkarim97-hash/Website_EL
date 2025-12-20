export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-2-1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt
        }),
      }
    );

    // MODEL BELUM READY (COMMON DI HF)
    if (response.status === 503) {
      return res.status(200).json({ loading: true });
    }

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({
        error: "HF Error",
        detail: err
      });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    res.status(200).json({ image: base64 });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      detail: error.message
    });
  }
}
