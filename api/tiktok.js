import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  // Ambil ID dari URL TikTok
  const match = url.match(/video\/(\d+)/);
  if (!match) return res.status(400).json({ error: "Missing ID" });

  const videoID = match[1];

  try {
    // API gratis TikMate (contoh)
    const apiURL = `https://api.tikmate.app/api/download?video_id=${videoID}`;

    const response = await fetch(apiURL);
    if (!response.ok) {
      return res.status(500).json({ error: "Server error", message: "fetch failed" });
    }

    const data = await response.json();

    // Pastikan ada video
    if (!data || !data.video || !data.video_no_watermark) {
      return res.status(404).json({ error: "Video tidak tersedia" });
    }

    return res.status(200).json({
      video: data.video,
      video_hd: data.video_hd,
      video_no_watermark: data.video_no_watermark,
      music: data.music || null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
}
