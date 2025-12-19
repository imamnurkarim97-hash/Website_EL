document.addEventListener("DOMContentLoaded", () => {

const MAX_LIMIT = 5;
let imageCount = parseInt(localStorage.getItem("imageCount")) || 0;

const input = document.getElementById("promptInput");
const box = document.getElementById("imageBox");

async function generateImage(){
  if(imageCount >= MAX_LIMIT){
    alert("Batas 5 gambar tercapai.");
    return;
  }

  const text = input.value.trim();
  if(!text) return;

  const user = document.createElement("div");
  user.className = "message user";
  user.textContent = text;
  box.appendChild(user);

  input.value = "";
  box.scrollTop = box.scrollHeight;

  const typing = document.createElement("div");
  typing.className = "message ai typing";
  typing.textContent = "EL sedang membuat gambar...";
  box.appendChild(typing);

  try{
    const res = await fetch("/api/image",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ prompt:text })
    });

    const data = await res.json();
    typing.remove();

    if(data.image){
      imageCount++;
      localStorage.setItem("imageCount", imageCount);

      const ai = document.createElement("div");
      ai.className = "message ai";
      ai.innerHTML = `
        <img src="${data.image}" style="width:100%;border-radius:14px;margin-bottom:8px">
        <a href="${data.image}" download class="menu-btn primary">⬇ Download</a>
      `;
      box.appendChild(ai);
    }else{
      typing.textContent = "Gagal membuat gambar.";
    }

  }catch{
    typing.textContent = "Server error.";
  }

  box.scrollTop = box.scrollHeight;
}

window.generateImage = generateImage;

});
