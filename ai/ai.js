async function sendMessage(){
  const input=document.getElementById("userInput");
  const chatBox=document.getElementById("chatBox");
  const text=input.value.trim();
  if(!text) return;

  // User message
  const user=document.createElement("div");
  user.className="message user";
  user.textContent=text;
  chatBox.appendChild(user);

  input.value="";
  chatBox.scrollTop=chatBox.scrollHeight;

  // Typing indicator
  const typing=document.createElement("div");
  typing.className="message ai typing";
  typing.textContent="EL sedang mengetik...";
  chatBox.appendChild(typing);

  try {
    const res=await fetch("/api/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:text})
    });

    const data=await res.json();
    typing.remove();

    const ai=document.createElement("div");
    ai.className="message ai";
    ai.textContent=data.reply || "EL tidak bisa menjawab.";
    chatBox.appendChild(ai);

  } catch {
    typing.remove();
    const err=document.createElement("div");
    err.className="message ai";
    err.textContent="EL gagal merespon.";
    chatBox.appendChild(err);
  }

  chatBox.scrollTop=chatBox.scrollHeight;
}
