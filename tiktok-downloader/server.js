import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/tiktok", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.json({ success: false, msg: "URL kosong" });

    // SCRAPE VIA SNAP-STYLE ENDPOINT
    const api = "https://ssstik.io/abc?url=dl";
    const form = new URLSearchParams();
    form.append("id", url);
    form.append("locale", "id");

    const { data } = await axios.post(api, form, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const hdNoWm = data.match(/href="(https:\/\/[^"]+)" class="without_watermark_hd"/);
    const sdNoWm = data.match(/href="(https:\/\/[^"]+)" class="without_watermark"/);
    const music = data.match(/href="(https:\/\/[^"]+)" class="music"/);

    if (!hdNoWm && !sdNoWm) {
      return res.json({ success: false, msg: "Gagal ambil video" });
    }

    res.json({
      success: true,
      data: {
        hdnowm: hdNoWm ? hdNoWm[1] : null,
        sdnowm: sdNoWm ? sdNoWm[1] : null,
        music: music ? music[1] : null
      }
    });
  } catch (e) {
    res.json({ success: false, msg: "Error server" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server jalan di http://localhost:3000");
});
