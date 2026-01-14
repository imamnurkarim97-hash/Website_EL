export default async function handler(req, res) {
  try {
    // Hanya izinkan GET
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL TikTok tidak ditemukan" });
    }

    // Ambil data dari API TikWM (tanpa watermark)
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Gagal mengambil data video" });
    }

    const data = await response.json();

    if (!data || !data.data || !data.data.play) {
      return res.status(500).json({ error: "Video tidak tersedia" });
    }

    // Kembalikan data penting saja
    return res.status(200).json({
      status: true,
      title: data.data.title,
      author: data.data.author?.nickname,
      video_no_watermark: data.data.play,
      video_watermark: data.data.wmplay,
      music: data.data.music,
      cover: data.data.cover,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
}
