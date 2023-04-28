const { request } = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const getQuestions = async (req, res) => {
  const{body}= req; 
  console.log(body); 
  // res.json({msg : body})
  const messages = [...body]
  //   let messages = [{ "role": "system", "content": "tell me a joke" }];
    const chatGPT = await openai.createChatCompletion({
      model: 'text-davinci-003',
      messages,
    });

    const chatGPTMessage = chatGPT.data.choices[0].message;

    console.log(chatGPTMessage);

    res.json({msg : 'déclenché', chatGPTMessage : chatGPTMessage});
 
};

module.exports = {
  getQuestions,
};
