const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');
const cryptoJS = require('crypto-js');
const loginValidation = require('./middleware/loginValidation');
const ensureAuthenticated = require('./middleware/ensureAuthenticated');
// const ensureAuthenticated = require('./middleware/ensureAuthenticated');

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

app.post('/login', loginValidation, async (req, res) => {
  // usei a documentação do CryptoJS e regex tenho praticado no
  // regexone e regex101. Doc: https://cryptojs.gitbook.io/docs/
    res.status(200).json({ token: cryptoJS.AES.encrypt('Message', 'Secret Passphrase').key
    .toString(cryptoJS.enc.Hex).match(/\w{16}/)[0] });
});

app.post('/talker', ensureAuthenticated, async (req, res) => {
  const talker = { ...req.body };
  const talkers = JSON.parse(await fs.readFile(pathTalkers));
  const newTalker = { 
    name: talker.name,
    age: talker.age,
    id: talkers[talkers.length - 1].id + 1 || 1,
    talk: {
      watchedAt: talker.talk.watchedAt,
      rate: talker.talk.rate,
    },
  };
  talkers.push(newTalker);
  await fs.writeFile(pathTalkers, JSON.stringify(talkers));
  res.status(201).json(newTalker);
});

app.put('/talker/:id', ensureAuthenticated, async (req, res) => {
  const talker = { ...req.body };
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile(pathTalkers));
  const index = talkers.findIndex((talk) => talk.id === +(id));
  const newTalker = { 
    name: talker.name,
    age: talker.age,
    id: +(id),
    talk: {
      watchedAt: talker.talk.watchedAt,
      rate: talker.talk.rate,
    },
  };
  talkers[index] = newTalker;
  await fs.writeFile(pathTalkers, JSON.stringify(talkers));
  res.status(200).json(newTalker);
});
