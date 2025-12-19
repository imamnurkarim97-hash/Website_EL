/* ===============================
   EL AI IMAGE GENERATOR
   Aman | Rapi | Anti Error
================================ */

const MAX_LIMIT = 5; // batas gambar per device
let imageCount = parseInt(localStorage.getItem("imageCount")) || 0;

// shortcut element
const promptInput = document.getElementById("promptInput");
const imageResult = document.getElementById("imageResult");
const historyBox = document.getElementById("history");

/* ===============================
   SET PRESET PROMPT
================================ */
function setPreset(text){
  promptInput.value = text;
  promptInput.focus();
}

/* ===============================
   AUTO PROMPT (BIAR RAPI)
================================ */
function autoPrompt(prompt){
  return `High quality, ultra detailed, sharp focus, cinematic lighting, realistic, ${prompt}`;
}

/* ===============================
   GENERATE IMAGE
================================ */
async function generateImage(){

  // limit check
  if(imageCount >= MAX_LIMIT){
    alert("Batas penggunaan tercapai (5 gambar).");
    return;
  }

  let prompt = promptInput.value.trim();
  if(!prompt){
    alert("Masukkan deskripsi gambar terlebih dahulu.");
    return;
  }

  prompt = autoPrompt(prompt);

  imageResult.innerHTML = `
    <div class="message ai typing">
      ⏳ EL sedang membuat gambar...
    </div>
  `;

  try{
    const res = await fetch("/api/image",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ prompt })
    });

    const data = await res.json();

    imageResult.innerHTML = "";

    if(!data.image){
      imageResult.innerHTML = `
        <div class="message ai">
          Gagal membuat gambar.
        </div>
      `;
      return;
    }

    imageCount++;
    localStorage.setItem("imageCount", imageCount);

    const html = `
      <div class="message ai">
        <img src="${data.image}" style="width:100%;border-radius:16px;margin-bottom:10px">
        <a href="${data.image}" download class="menu-btn primary">
          ⬇ Download Gambar
        </a>
      </div>
    `;

    imageResult.innerHTML = html;

    // simpan ke gallery history
    const img = document.createElement("img");
    img.src = data.image;
    historyBox.prepend(img);

  }catch(err){
    imageResult.innerHTML = `
      <div class="message ai">
        ❌ EL gagal merespon server.
      </div>
    `;
  }
}
