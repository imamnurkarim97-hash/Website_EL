async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat");

  if (!input.value) return;

  chat.innerHTML += `<p><b>Kamu:</b> ${input.value}</p>`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input.value })
  });

  const data = await res.json();
  chat.innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;

  input.value = "";
}
