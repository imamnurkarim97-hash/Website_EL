const MAX_LIMIT = 5;
let count = localStorage.getItem("imageCount") || 0;

function autoPrompt(text){
  return `High quality, ultra detailed, cinematic lighting, ${text}`;
}

async function generateImage(){
  const input = document.getElementById("promptInput");
  const result = document.getElementById("imageResult");
  const history = document.getElementById("history");

  if(count >= MAX_LIMIT){
    alert("Batas penggunaan tercapai");
    return;
  }

  let prompt = input.value.trim();
  if(!prompt){
    alert("Masukkan deskripsi gambar");
    return;
  }

  prompt = autoPrompt(prompt);

  result.innerHTML = "<p>⏳ Membuat gambar...</p>";

  try{
    const res = await fetch("/api/image",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ prompt })
    });

    const data = await res.json();

    if(data.image){
      count++;
      localStorage.setItem("imageCount", count);

      const img = document.createElement("img");
      img.src = data.image;

      history.prepend(img);

      result.innerHTML = `
        <img src="${data.image}" style="width:100%;border-radius:16px">
        <a href="${data.image}" download class="menu-btn primary">⬇ Download</a>
      `;
    }else{
      result.innerHTML = "Gagal membuat gambar";
    }

  }catch{
    result.innerHTML = "Server error";
  }
}
