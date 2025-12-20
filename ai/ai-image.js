async function generateImage() {
  const promptInput = document.getElementById("imagePrompt");
  const imageBox = document.getElementById("imageBox");
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  // Loading
  imageBox.innerHTML = "<p>EL sedang membuat gambar...</p>";

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (!res.ok || !data.imageUrl) {
      throw new Error("Gagal membuat gambar");
    }

    imageBox.innerHTML = `<img src="${data.imageUrl}" alt="AI Image">`;
    promptInput.value = "";

  } catch (err) {
    imageBox.innerHTML = `<p>EL gagal membuat gambar.</p>`;
    console.error(err);
  }
}
