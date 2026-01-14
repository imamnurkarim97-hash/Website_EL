import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL TikTok tidak ada" });
    }

    // API alternatif (AMAN UNTUK VERCEL)
    const apiURL = "https://api.tiklydown.me/api/download";
    const response = await axios.post(apiURL, {
      url: url
    }, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 15000
    });

    const data = response.data;

    if (!data || !data.video) {
      return res.status(500).json({ error: "Video tidak tersedia" });
    }

    // KONTRAK DATA SESUAI FRONTEND KAMU
    return res.status(200).json({
      video: data.video,
      video_hd: data.video_hd || data.video,
      video_no_watermark: data.video_no_watermark || data.video,
      music: data.music
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
