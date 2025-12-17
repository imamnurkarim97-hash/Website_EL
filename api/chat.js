import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // ✅ MODEL BARU (AKTIF)
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah AI bernama EL. Jawablah singkat, jelas, dan mudah dipahami.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid response from AI", detail: data });
    }

    res.status(200).json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      detail: error.message,
    });
  }
}
