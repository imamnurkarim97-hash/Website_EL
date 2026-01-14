export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL TikTok tidak ada" });
    }

    const apiUrl = `https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`;
    const r = await fetch(apiUrl);
    const j = await r.json();

    if (!j || !j.video) {
      return res.status(500).json({ error: "Video tidak tersedia" });
    }

    return res.status(200).json({
      video: j.video.noWatermark || j.video.watermark,
      video_hd: j.video.noWatermark || j.video.watermark,
      video_no_watermark: j.video.noWatermark,
      music: j.music || null
    });

  } catch (e) {
    return res.status(500).json({
      error: "Server error",
      message: e.message
    });
  }
}
