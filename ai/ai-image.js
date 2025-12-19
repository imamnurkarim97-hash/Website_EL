document.addEventListener("DOMContentLoaded", () => {

/* ===============================
   EL AI IMAGE GENERATOR
================================ */

const MAX_LIMIT = 5;
let imageCount = parseInt(localStorage.getItem("imageCount")) || 0;

const promptInput = document.getElementById("promptInput");
const imageResult = document.getElementById("imageResult");
const historyBox = document.getElementById("history");

function setPreset(text){
  promptInput.value = text;
  promptInput.focus();
}

function autoPrompt(prompt){
  return `High quality, ultra detailed, cinematic lighting, realistic, ${prompt}`;
}

async function generateImage(){

  if(imageCount >= MAX_LIMIT){
    alert("Batas penggunaan tercapai (5 gambar).");
    return;
  }

  let prompt = promptInput.value.trim();
  if(!prompt){
    alert("Masukkan deskripsi gambar.");
    return;
  }

  prompt = autoPrompt(prompt);

  imageResult.innerHTML = `
    <div class="message ai typing">⏳ Membuat gambar...</div>
  `;

  try{
    const res = await fetch("/api/image",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ prompt })
    });

    const data = await res.json();
    imageResult.innerHTML = "";

    if(!data.image){
      imageResult.innerHTML = "<div class='message ai'>Gagal membuat gambar.</div>";
      return;
    }

    imageCount++;
    localStorage.setItem("imageCount", imageCount);

    imageResult.innerHTML = `
      <div class="message ai">
        <img src="${data.image}" style="width:100%;border-radius:16px">
        <a href="${data.image}" download class="menu-btn primary">⬇ Download</a>
      </div>
    `;

    const img = document.createElement("img");
    img.src = data.image;
    historyBox.prepend(img);

  }catch{
    imageResult.innerHTML = "<div class='message ai'>Server error.</div>";
  }
}

// expose ke HTML
window.generateImage = generateImage;
window.setPreset = setPreset;

});
