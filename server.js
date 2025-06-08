// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post('/chat', async (req, res) => {
//   const userMessage = req.body.message;

//   try {
//     const response = await axios.post(
//       'https://api.groq.com/openai/v1/chat/completions',
//       {
//         model: 'llama3-8b-8192',
//         messages: [
//           { role: 'system', content: `Tum ek karyana store ke chatbot ho. Sirf karyana (grocery) se jude sawalon ka jawab do.
// Agar user kuch bhi aisa pooche jo karyana se sambandhit nahi ho, to politely mana kar do aur bolo: "Main sirf karyana store se jude sawalon ka jawab deta hoon."
// Hamesha apna jawab 1-2 line me, simple, chhota aur local dukaan jaise do. 
// Agar koi item ka rate pooche to bas item ka naam aur ek simple rate batao (jaise "chini ₹45/kg"). 
// User jis language mein baat kare, usi language mein jawab do.`},
//           { role: 'user', content: userMessage }
//         ],
//         max_tokens: 150
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const botReply = response.data.choices[0].message.content;
//     res.json({ reply: botReply });
//   } catch (error) {
//     // Yeh line error ko detail me print karegi
//     console.error("Groq API Error:", error?.response?.data || error.message, error?.response?.status);
//     res.status(500).json({ reply: "Groq AI se connection error" });
//   }
// });

// app.listen(3000, () => {
//   console.log('✅ Groq Chatbot server chalu hai at http://localhost:3000');
// });


const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: `Tum ek karyana store ke chatbot ho. Sirf karyana (grocery) se jude sawalon ka jawab do.
Agar user kuch bhi aisa pooche jo karyana se sambandhit nahi ho, to politely mana kar do aur bolo: "Main sirf karyana store se jude sawalon ka jawab deta hoon."
Hamesha apna jawab 1-2 line me, simple, chhota aur local dukaan jaise do. 
Agar koi item ka rate pooche to bas item ka naam aur ek simple rate batao (jaise "chini ₹45/kg"). 
User jis language mein baat kare, usi language mein jawab do.`},
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
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Groq API Error:", error?.response?.data || error.message, error?.response?.status);
    res.status(500).json({ reply: "Groq AI se connection error" });
  }
});

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Groq Chatbot server chalu hai at http://localhost:${PORT}`);
  });
}