export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const HF_API_KEY = process.env.HF_API_KEY;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: req.body.prompt
        })
      }
    );

    // ⏳ Model loading
    if (response.status === 503) {
      return res.status(503).json({
        loading: true,
        message: "Model sedang loading, tunggu 10–30 detik lalu coba lagi"
      });
    }

    const image = await response.arrayBuffer();
    const base64 = Buffer.from(image).toString("base64");

    res.status(200).json({ image: base64 });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
