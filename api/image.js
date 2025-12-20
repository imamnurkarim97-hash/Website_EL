export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt kosong" });
    }

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (hfRes.status === 503) {
      return res.json({ loading: true });
    }

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return res.status(500).json({ error: text });
    }

    const buffer = await hfRes.arrayBuffer();
    const image = Buffer.from(buffer).toString("base64");

    return res.json({ image });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
