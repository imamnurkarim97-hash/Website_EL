export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL TikTok wajib diisi" });
  }

  try {
    // API pihak ketiga (no watermark)
    const apiURL =
      "https://api.tiklydown.eu.org/api/download?url=" +
      encodeURIComponent(url);

    const response = await fetch(apiURL);
    const data = await response.json();

    if (!data || !data.video) {
      return res.status(500).json({ error: "Gagal mengambil video" });
    }

    // NORMALISASI agar cocok dengan frontend kamu
    res.status(200).json({
      play: data.video,                         // SD
      hdplay: data.video_hd || data.video,      // HD
      music: data.music || null                 // MP3
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
                        }
