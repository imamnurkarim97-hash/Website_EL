export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL TikTok kosong" });
  }

  try {
    const api = await fetch(
      "https://tikwm.com/api/?url=" + encodeURIComponent(url)
    );
    const json = await api.json();

    if (json.code !== 0) {
      return res.status(500).json({ error: "Gagal mengambil video" });
    }

    res.status(200).json({
      play: json.data.play,
      hdplay: json.data.hdplay,
      music: json.data.music
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
