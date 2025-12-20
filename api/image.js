export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt kosong" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
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

    // Model belum siap
    if (response.status === 503) {
      return res.json({ loading: true });
    }

    // Error dari HF
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "HF Error",
        detail: text,
      });
    }

    const buffer = await response.arrayBuffer();

    if (!buffer || buffer.byteLength < 1000) {
      return res.status(500).json({
        error: "Gambar tidak tersedia di server",
      });
    }

    const base64Image = Buffer.from(buffer).toString("base64");

    res.status(200).json({
      image: base64Image,
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
