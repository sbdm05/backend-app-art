// api/v1/prompt.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export default async function handler(req, res) {
//   console.log('Endpoint appelé, méthode:', req.method);
//   return res.json({
//     message: 'Test OK',
//     method: req.method,
//     timestamp: new Date().toISOString(),
//   });
// }
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const messages = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 200,
    });

    const chatGPTMessage = chatCompletion.choices[0].message;

    return res.status(200).json({ chatGPTMessage });
  } catch (error) {
    console.error('Erreur OpenAI :', error.response?.data || error.message);
    return res.status(500).json({
      error: 'OpenAI API failed',
      details: error.message,
    });
  }
}
