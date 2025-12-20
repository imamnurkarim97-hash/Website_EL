async function generateImage() {
  const promptInput = document.getElementById("prompt");
  const chat = document.querySelector(".chat");
  const prompt = promptInput.value.trim();
  if (!prompt) return;

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
  loading.textContent = "EL sedang membuat gambar… ⏳";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.error) {
      loading.textContent = `❌ Gagal: ${data.error}`;
      return;
    }

    // Hapus loading
    loading.remove();

    const imgBubble = document.createElement("div");
    imgBubble.className = "bubble ai";
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${data.image}`;
    imgBubble.appendChild(img);
    chat.appendChild(imgBubble);
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    loading.textContent = "❌ Gagal membuat gambar.";
  }
}
