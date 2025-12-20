const btn = document.getElementById("generate");
const img = document.getElementById("resultImage");

btn.onclick = generate;
document.getElementById("prompt").addEventListener("keydown", e => {
  if (e.key === "Enter") generate();
});

async function generate(){
  const prompt = document.getElementById("prompt").value;
  const file = document.getElementById("imageInput").files[0];

  if (!prompt) return alert("Prompt wajib diisi");

  img.style.display = "none";
  btn.innerText = "Loading...";

  const form = new FormData();
  form.append("prompt", prompt);
  if (file) form.append("image", file);

  try{
    const res = await fetch("/api/image", {
      method:"POST",
      body:form
    });

    const data = await res.json();
    if (!data.image) throw "Gagal";

    img.src = data.image;
    img.style.display = "block";

  }catch(e){
    alert("Gagal membuat gambar");
  }

  btn.innerText = "Generate";
}
