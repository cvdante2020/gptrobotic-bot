// src/utils/openai.js

const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Asegúrate que esté en tu .env

const consultarChatGPT = async (mensajeUsuario) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente especializado en elaboracion de Chatbot, Marketing y diseño de paginas web, toma muy en cuenta lo que tenemos en la pagina de gptrobotic.com',
          },
          {
            role: 'user',
            content: mensajeUsuario,
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const respuestaGPT = response.data.choices[0].message.content.trim();
    return respuestaGPT;
  } catch (error) {
    console.error('❌ Error al consultar ChatGPT:', error.response?.data || error.message);
    return 'Lo siento, estoy teniendo dificultades para responder en este momento. 🙏';
  }
};

module.exports = { consultarChatGPT };
