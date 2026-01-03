import axios from "axios";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ code: 1, message: "URL kosong" });

  try {
    const response = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ code: 1, message: "Gagal ambil video" });
  }
}
