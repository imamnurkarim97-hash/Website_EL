import fetch from "node-fetch";

export default async function handler(req, res){
  if(req.method !== "POST"){
    return res.status(405).json({ error:"Method not allowed" });
  }

  if(!process.env.OPENAI_API_KEY){
    return res.status(500).json({ error:"API key belum diset" });
  }

  const { prompt } = req.body;
  if(!prompt){
    return res.status(400).json({ error:"Prompt kosong" });
  }

  try{
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
        },
        body:JSON.stringify({
          model:"gpt-image-1",
          prompt,
          size:"1024x1024"
        })
      }
    );

    const data = await response.json();

    res.status(200).json({
      image: data.data[0].url
    });

  }catch(e){
    res.status(500).json({ error:"Gagal generate" });
  }
}
