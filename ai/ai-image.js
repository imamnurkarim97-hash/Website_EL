async function generateImage(){
  const promptInput = document.getElementById("prompt");
  const chat = document.getElementById("chat");

  const prompt = promptInput.value.trim();
  if(!prompt) return;

  // Bubble user
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.textContent = prompt;
  chat.appendChild(userBubble);

  promptInput.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Bubble loading
  const loading = document.createElement("div");
  loading.className = "bubble ai loading";
  loading.textContent = "🎨 EL sedang membuat gambar...";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try{
    const res = await fetch("/api/image",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ prompt })
    });

    const data = await res.json();

    // ⏳ Model masih loading (HuggingFace)
    if(data.loading){
      loading.textContent =
        "⏳ Model sedang loading (10–30 detik), klik Generate lagi ya…";
      return;
    }

    // Hapus loading
    loading.remove();

    // Bubble AI
    const imgBubble = document.createElement("div");
    imgBubble.className = "bubble ai";

    const img = document.createElement("img");

    // ✅ SUPPORT BASE64 & URL
    if(data.image){
      if(data.image.startsWith("http")){
        img.src = data.image;
      }else{
        img.src = `data:image/png;base64,${data.image}`;
      }
    }else{
      imgBubble.textContent = "❌ Gambar tidak tersedia dari server.";
      chat.appendChild(imgBubble);
      return;
    }

    imgBubble.appendChild(img);
    chat.appendChild(imgBubble);
    chat.scrollTop = chat.scrollHeight;

  }catch(err){
    loading.textContent = "❌ Gagal membuat gambar (server error).";
    console.error(err);
  }
}

// ENTER SUPPORT
function handleEnter(e){
  if(e.key === "Enter"){
    generateImage();
  }
}
