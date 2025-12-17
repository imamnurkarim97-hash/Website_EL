import fetch from "node-fetch";

export default async function handler(req, res) {
  // WAJIB: hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message kosong" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `
Nama kamu EL.
Jawab seperti ChatGPT:
- Singkat
- Padat
- Jelas
- Maksimal 5 paragraf
- Jangan spam bold
- Gunakan list hanya jika perlu
`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();

    // CEK kalau API error
    if (!data.choices) {
      return res.status(500).json({
        error: "Groq API error",
        detail: data
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
