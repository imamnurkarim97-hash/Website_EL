import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Masukkan URL TikTok" });

  try {
    // Gunakan API gratis anti blokir
    // Disini kita gunakan api.tikmate.app sebagai contoh free & no block
    const apiURL = `https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    if (!data || !data.video) {
      return res.status(404).json({ error: "Video tidak tersedia" });
    }

    // Return object yang sesuai dengan frontend HTML kamu
    res.status(200).json({
      video: data.video.play,            // SD
      video_hd: data.video.play_hd,      // HD
      video_no_watermark: data.video.play_no_watermark, // HD no watermark
      music: data.music?.play || null    // musik (jika ada)
    });
  } catch (err) {
    console.error("Backend fetch error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
}
