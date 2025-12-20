const btn = document.getElementById("generate");
const img = document.getElementById("resultImage");
const input = document.getElementById("prompt");

btn.onclick = generate;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") generate();
});

async function generate() {
  const prompt = input.value.trim();
  if (!prompt) return alert("Prompt wajib diisi");

  btn.innerText = "Generating...";
  img.style.display = "none";

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.loading) {
      alert("Model sedang loading, tunggu 10–30 detik lalu coba lagi");
      btn.innerText = "Generate";
      return;
    }

    if (!data.image) throw "No image";

    img.src = data.image;
    img.style.display = "block";

  } catch (e) {
    alert("Gagal membuat gambar");
  }

  btn.innerText = "Generate";
}
