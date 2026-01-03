import axios from "axios";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL tidak ada" });

  try {
    // TikWM API
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.code !== 0) return res.status(500).json({ error: "Gagal ambil video" });

    res.status(200).json({
      play: data.data.play,         // SD
      hdplay: data.data.hdplay,     // HD
      nowmplay: data.data.nowmplay, // HD tanpa watermark
      music: data.data.music
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
