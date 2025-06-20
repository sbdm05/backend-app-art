const { request } = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const getQuestions = async (req, res) => {
  const { body } = req;
  console.log(body, 'body');
  const messages2 = body.message;
  console.log(messages2, 'messages');

  let messages = [{ role: 'system', content: 'tell me a joke' }];

  try {
    // const chatGPT = await openai.createCompletion(
    //   {
    //     model: 'text-davinci-002',
    //     prompt: messages2,
    //     stream: true,
    //     max_tokens: 1000,
    //   },
    //   { responseType: 'stream' }
    // );

    const chatGPT = await openai.createCompletion(
      {
        model: 'text-davinci-002',
        prompt: messages2,
        stream: true,
        max_tokens: 1000,
      },
      { responseType: 'stream' }
    );
    // chatGPT.data.on('data', (data) => {
    //   console.log(data, 'data')

    //   const lines = data
    //     .toString()
    //     .split('\n')
    //     .filter((line) => line.trim() !== '');

    //   // for (const line of lines) {
    //   //   console.log(line, 'line')
    //   //   console.log(line.data, 'after replace');
    //   //   const message = line.replace(/^data: /, '');

    //   //   if (message === '[DONE]') {
    //   //     res.end(); // Terminate the response and close the stream
    //   //     return; // Stream finished
    //   //   }

    //   //   try {
    //   //     const parsed = JSON.parse(message);

    //   //     let temp = parsed.choices[0].text;

    //   //     console.log(temp, 'temporaire');
    //   //     if (!res.writableEnded) {
    //   //       res.write(temp + 'temp');
    //   //     }
    //   //   } catch (error) {
    //   //     console.error('Could not JSON parse stream message', message, error);
    //   //   }
    //   // }
    // });

    chatGPT.data.on('data', (data) => {
      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '');

      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          res.end(); // Terminate the response and close the stream
          return; // Stream finished
        }

        try {
          const parsed = JSON.parse(message);

          let temp = parsed.choices[0].text;

          console.log(temp);
          if (!res.writableEnded) {
            res.write(temp);
          }
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }
    });

    chatGPT.data.on('end', () => {
      console.log('All data received.');
    });
  } catch (error) {
    if (error.response?.status) {
      //console.error(error.response.status, error.message);
      error.response.data.on('data', (data) => {
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          console.error(
            'An error occurred during OpenAI request dans try: ',
            parsed
          );
        } catch (error) {
          console.error(
            'An error occurred during OpenAI request dans catch: ',
            message
          );
        }
      });
    } else {
      console.error(
        'An error occurred during OpenAI request dans le else',
        error
      );
    }
  }

  //process.stdout.write('\n');

  // const chatGPTMessage = chatGPT.data.choices[0].message;

  //console.log(chatGPTMessage);
};

const onPrompt = async (req, res) => {
  try {
    const messages = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Version test simple pour vérifier que ça répond vite
    return res.json({ msg: 'test de réponse backend OK' });

    // const chatGPT = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   messages,
    //   max_tokens: 200, // Limite la réponse pour éviter les timeouts
    // });

    // const chatGPTMessage = chatGPT.data.choices[0].message;
    // console.log('Réponse OpenAI :', chatGPTMessage);

    // return res.json({ chatGPTMessage });
  } catch (error) {
    console.error('Erreur OpenAI :', error);
    return res
      .status(500)
      .json({ error: 'OpenAI API failed', details: error.message });
  }
};

module.exports = {
  getQuestions,
  onPrompt,
};
