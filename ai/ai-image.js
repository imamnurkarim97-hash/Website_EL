async function generateImage() {
  const input = document.getElementById("promptInput");
  const result = document.getElementById("result");

  const prompt = input.value.trim();
  if (!prompt) return;

  result.innerHTML = "⏳ EL sedang menggambar...";

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (!data.image) {
      throw new Error("Gagal generate");
    }

    result.innerHTML = `<img src="${data.image}" style="width:100%;border-radius:16px;">`;

  } catch (e) {
    result.innerHTML = "❌ Gagal membuat gambar";
  }
}
