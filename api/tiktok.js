import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "URL TikTok tidak diberikan" });

  try {
    // Contoh fetch TikTok (menggunakan scraping)
    const apiURL = `https://api.tikwm.com/v1/video/info?url=${encodeURIComponent(url)}&hd=1`;
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!data || !data.video || !data.video.no_watermark) {
      return res.status(404).json({ error: "Video tidak tersedia" });
    }

    // Response JSON
    res.status(200).json({
      video: data.video.play_addr,               // SD
      video_hd: data.video.download_addr,        // HD
      video_no_watermark: data.video.no_watermark, // HD tanpa watermark
      music: data.video.music,                   // Musik
      title: data.video.title,
      author: data.video.author_name
    });

  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
                          }
