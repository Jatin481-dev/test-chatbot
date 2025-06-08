const axios = require('axios');

module.exports = async (req, res) => {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: `Tum ek karyana store ke chatbot ho. Tum dukaan ke nokar ho, user ki har karyana se judi madad karo: saman ka rate batao, saman pack karo, aur agar user bill maange to ek simple bill bana ke do (item, rate, quantity, total). Packing ya "pack kar do" bole to friendly tareeke se "Bilkul, pack ho gaya! Aur kuch?" bolo aur turant bill dikhao. Fir user se puchho: "UPI se karoge ya cash?" Agar user UPI bole to ek scanner ki photo dikhao. Agar user kisi item maange to related saman recommend karo (jaise aata ke saath besan). Hamesha apna jawab 1-2 line me, simple, chhota aur local dukaan jaise do. User jis language mein baat kare, usi language mein jawab do. Sirf karyana se related sawalon ka jawab do, baki sab par politely mana kar do."`},
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Groq API Error:", error?.response?.data || error.message, error?.response?.status);
    res.status(500).json({ reply: "Groq AI se connection error" });
  }
};
