const axios = require('axios');

async function sendMessageToPythonBot(message) {

  try {
    const response = await axios.post('http://localhost:8000/chat', { message });
    return response.data;

  } catch (error) {
    console.error('Error communicating with Python bot:', error);
    throw new Error('Failed to communicate with Python bot');
  }
}

module.exports = {
  sendMessageToPythonBot,
};