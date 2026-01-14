export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "URL TikTok tidak ditemukan"
      });
    }

    // API pihak ketiga (stabil & umum dipakai)
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const r = await fetch(api);
    const j = await r.json();

    if (!j || j.code !== 0) {
      return res.status(500).json({
        error: "Video tidak tersedia"
      });
    }

    // ⚠️ KONTRAK DATA SESUAI FRONTEND KAMU
    return res.status(200).json({
      video: j.data.play,
      video_hd: j.data.hdplay || j.data.play,
      video_no_watermark: j.data.play,
      music: j.data.music
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
