import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Olá Vinteoitao'
  })
})

app.post('/', async (req, res) => {
  try {
    const topic = req.body.topic; // Assuming you send the topic as part of the request

    let prompt;

    // Customize the prompt based on the specified topic
    switch (topic) {
      case 'academia':
        prompt = 'Discuta as últimas tendências e avanços na academia.';
        break;
      case 'fisiculturismo':
        prompt = 'Forneça informações sobre técnicas eficazes de treinamento fisiculturismo.';
        break;
      case 'saude':
        prompt = 'Discuta a importância de manter um estilo de vida saudável para o bem-estar geral.';
        break;
      default:
        prompt = 'Prompt padrão para consultas gerais.';
    }

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Algo deu errado');
  }
})

app.listen(5000, () => console.log('Servidor de IA iniciado em http://localhost:5000'))
