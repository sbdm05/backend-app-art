const { request } = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

let tempArray = [];

const openai = new OpenAIApi(configuration);

const getQuestions = async (req, res) => {
  const { body } = req;
  const messages = [...body];
  
  try {
    const chatGPT = await openai.createCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0,
        stream: true,
      },
      { responseType: 'stream' }
    );

    chatGPT.data.on('data', (data) => {
      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          const parsed = JSON.parse(message);
          let temp = parsed.choices[0].text;

          res.json({ message: temp });

          return; // Stream finished
        }
        try {
          const parsed = JSON.parse(message);
          console.log(parsed, 'parsed');
          let temp = parsed.choices[0].text;

          // tempArray.push(temp);

          // console.log(tempArray);
          if (!res.writableEnded) {
            res.json({ message: temp });
          }
          // console.log(temp, 'temp'); // string
          //res.json({ message: temp });
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }
    });
  } catch (error) {
    if (error.response?.status) {
      console.error(error.response.status, error.message);
      error.response.data.on('data', (data) => {
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          console.error('An error occurred during OpenAI request: ', parsed);
        } catch (error) {
          console.error('An error occurred during OpenAI request: ', message);
        }
      });
    } else {
      console.error('An error occurred during OpenAI request', error);
    }
  }

  process.stdout.write('\n');

  // const chatGPTMessage = chatGPT.data.choices[0].message;

  //console.log(chatGPTMessage);
};

const onPrompt = async (req, res) => {
  const { body } = req;
  console.log(body);
  // res.json({msg : body})
  const messages = [...body];
  //   let messages = [{ "role": "system", "content": "tell me a joke" }];
  const chatGPT = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  });

  const chatGPTMessage = chatGPT.data.choices[0].message;

  console.log(chatGPTMessage);

  res.json({ msg: 'déclenché', chatGPTMessage: chatGPTMessage });
};

module.exports = {
  getQuestions,
  onPrompt,
};
