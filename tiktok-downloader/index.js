const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/tiktok", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL tidak ada" });

  try {
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await axios.get(api);
    const data = response.data;

    if (data.code !== 0) return res.status(500).json({ error: "Gagal ambil video" });

    res.json({
      play: data.data.play,       // SD
      hdplay: data.data.hdplay,   // HD
      hdnowm: data.data.nowmplay, // HD tanpa watermark (API backend harus mendukung)
      music: data.data.music
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`TikTok Downloader running on port ${port}`));
