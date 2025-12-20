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
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "image/png"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    if (!hfRes.ok) {
      const err = await hfRes.text();
      return res.status(500).json({ error: "HF Error", detail: err });
    }

    const buffer = Buffer.from(await hfRes.arrayBuffer());
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);

  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
