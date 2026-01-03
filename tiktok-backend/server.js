import express from "express";
import cors from "cors";
import { tiktokdl } from "@bochilteam/scraper";

const app = express();

/* IZINKAN SEMUA DOMAIN (AGAR TIDAK RUSAK WEBSITE) */
app.use(cors());

app.get("/tiktok", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.json({ error: "URL kosong" });
    }

    const data = await tiktokdl(url);

    res.json({
      data: {
        play: data.video.no_watermark,
        hdplay: data.video.no_watermark_hd || data.video.no_watermark,
        music: data.music
      }
    });
  } catch (e) {
    res.json({ error: "Gagal mengambil video" });
  }
});

/* PORT WAJIB DINAMIS UNTUK HOSTING */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API jalan di port", PORT);
});
