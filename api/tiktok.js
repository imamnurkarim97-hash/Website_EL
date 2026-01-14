import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.includes("tiktok.com")) {
    return res.status(400).json({ error: "URL TikTok tidak valid" });
  }

  try {
    // Gunakan API TikTok gratis internal
    const tiktokAPI = `https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`;

    const response = await fetch(tiktokAPI, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      timeout: 10000
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Server error", message: "fetch failed" });
    }

    const data = await response.json();

    // Pastikan ada video HD / no watermark
    if (!data || (!data.video && !data.videoNoWatermark && !data.videoHD)) {
      return res.status(404).json({ error: "Video tidak tersedia" });
    }

    res.status(200).json({
      video: data.video || null,
      video_hd: data.videoHD || null,
      video_no_watermark: data.videoNoWatermark || null,
      music: data.music || null
    });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error", message: "fetch failed" });
  }
}
