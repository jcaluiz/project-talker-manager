const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const pathTalkers = path.resolve(__dirname, 'talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talkers = JSON.parse(await fs.readFile(pathTalkers));
  res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { params } = req;
  const idParams = params.id;
  const talkers = JSON.parse(await fs.readFile(pathTalkers));
  const idTalker = talkers.find((item) => item.id === +(idParams));
  if (!idTalker) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(idTalker);
}); 