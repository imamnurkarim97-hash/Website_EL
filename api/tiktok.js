import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Masukkan URL TikTok" });

  try {
    // Pakai API publik gratis anti blokir
    const apiURL = `https://free-tiktok-downloader-api.vercel.app/api/download?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();

    // Pastikan minimal ada satu video
    if (!data || (!data.video && !data.video_hd && !data.video_no_watermark)) {
      return res.status(404).json({ error: "Video tidak tersedia" });
    }

    // Kirim data ke frontend
    return res.status(200).json(data);

  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
      }
