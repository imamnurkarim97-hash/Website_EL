const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

async function expandUrl(url) {
  try {
    const r = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: s => s >= 300 && s < 400,
    });
    if (r.headers.location) return r.headers.location;
  } catch (e) {
    if (e.response?.headers?.location) {
      return e.response.headers.location;
    }
  }
  return url;
}

app.get("/tiktok", async (req, res) => {
  let url = req.query.url;
  if (!url) return res.json({ error: "URL kosong" });

  try {
    if (url.includes("vt.tiktok.com") || url.includes("/t/")) {
      url = await expandUrl(url);
    }

    const api = "https://tikwm.com/api/?url=" + encodeURIComponent(url);
    const r = await axios.get(api, { timeout: 20000 });

    res.json(r.data);
  } catch (e) {
    res.json({ error: "Gagal ambil video" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
