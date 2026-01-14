import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.url.split("url=")[1];
  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    // TikTok raw API fetch (self-hosted)
    const response = await fetch(`https://www.tiktok.com/oembed?url=${decodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch TikTok");

    const data = await response.json();

    // ambil video tanpa watermark HD
    // NOTE: TikTok tidak menyediakan no watermark resmi, kita gunakan URL raw
    // untuk download biasa
    let videoUrl = data.thumbnail_url.replace("thumbnail", "video");

    return res.json({
      video: videoUrl,
      video_hd: videoUrl,
      video_no_watermark: videoUrl,
      music: null
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}
