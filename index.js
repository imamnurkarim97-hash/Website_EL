const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tiktok', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ code: 1, message: "URL kosong" });

  try {
    const response = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (e) {
    res.json({ code: 1, message: "Gagal ambil video" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
