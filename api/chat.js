export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah EL, asisten AI yang menjawab singkat, jelas, dan ramah dalam bahasa Indonesia."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.5,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.error(data);
      return res.status(500).json({ error: "Invalid response from AI" });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
