async function generateImage() {
  const input = document.getElementById("prompt");
  const chat = document.querySelector(".chat");

  const prompt = input.value.trim();
  if (!prompt) return;

  // Bubble user
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.textContent = prompt;
  chat.appendChild(userBubble);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Bubble loading
  const loading = document.createElement("div");
  loading.className = "bubble ai loading";
  loading.textContent = "🎨 EL sedang membuat gambar…";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      loading.textContent = "❌ Gagal membuat gambar.";
      return;
    }

    const blob = await res.blob();
    loading.remove();

    const imgBubble = document.createElement("div");
    imgBubble.className = "bubble ai";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    img.alt = prompt;

    imgBubble.appendChild(img);
    chat.appendChild(imgBubble);
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    loading.textContent = "❌ Error saat generate gambar.";
  }
}

// ENTER untuk generate
document.getElementById("prompt").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    generateImage();
  }
});
