const btn = document.getElementById("generate");
const img = document.getElementById("resultImage");

btn.onclick = generate;
document.getElementById("prompt").addEventListener("keydown", e => {
  if (e.key === "Enter") generate();
});

async function generate(){
  const prompt = document.getElementById("prompt").value;
  if (!prompt) return alert("Prompt wajib diisi");

  btn.innerText = "Generating...";
  img.style.display = "none";

  const form = new FormData();
  form.append("prompt", prompt);

  try {
    const res = await fetch("/api/image", {
      method:"POST",
      body:form
    });

    const data = await res.json();

    if (data.loading) {
      alert("Model sedang loading, coba lagi 10–30 detik");
      btn.innerText = "Generate";
      return;
    }

    if (!data.image) throw "No image";

    img.src = data.image;
    img.style.display = "block";

  } catch {
    alert("Gagal membuat gambar");
  }

  btn.innerText = "Generate";
}
