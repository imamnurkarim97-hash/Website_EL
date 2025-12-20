const input = document.getElementById("imagePrompt");
const imageBox = document.getElementById("imageBox");

// ENTER KEY
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generateImage();
  }
});

async function generateImage() {
  const prompt = input.value.trim();
  if (!prompt) return;

  imageBox.innerHTML = "<p>🎨 EL sedang menggambar...</p>";

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok || !data.imageUrl) {
      throw new Error("Gagal generate gambar");
    }

    imageBox.innerHTML = `
      <img src="${data.imageUrl}" alt="EL AI Image">
    `;
    input.value = "";

  } catch (err) {
    imageBox.innerHTML = "<p>❌ EL gagal membuat gambar</p>";
    console.error(err);
  }
}
