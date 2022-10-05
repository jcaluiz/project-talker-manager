const messageJSON = {
    tokenNotFound: 'Token não encontrado',
    invalidToken: 'Token inválido',
    nameRequired: 'O campo "name" é obrigatório',
    nameSize: 'O "name" deve ter pelo menos 3 caracteres',
    ageRequired: 'O campo "age" é obrigatório',
    legalAge: 'A pessoa palestrante deve ser maior de idade',
    requiredTalkField: 'O campo "talk" é obrigatório',
    requiredRateField: 'O campo "rate" é obrigatório',
    requiredWatchedAtField: 'O campo "watchedAt" é obrigatório',
    rateBetweenOneNFive: 'O campo "rate" deve ser um inteiro de 1 à 5',
    dateFormat: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
};

const keyObject = ['tokenNotFound', 'invalidToken', 'nameRequired', 'nameSize', 'ageRequired', 
'legalAge', 'requiredTalkField', 'requiredRateField', 'requiredWatchedAtField',
 'rateBetweenOneNFive', 'dateFormat'];

const status = (token) => (!token || (token 
  && (token.length < 16 || token.length > 16)) ? 401 : 400);

const nameSizeFunction = (body) => body.name && body.name.length < 3;

const invalidTokenFunction = (token) => token && (token.length < 16 || token.length > 16);

const requiredRateFieldFunction = (body) => body.talk && !body.talk.rate;

const requiredWatchedAtFieldFunction = (body) => body.talk && !body.talk.watchedAt;

const rateBetweenOneNFiveFunction = (body) => body.talk 
  && (body.talk.rate < 1 || body.talk.rate > 5);

const dateFormatFunction = (body) => (body.talk && body.talk.watchedAt) 
  && !body.talk.watchedAt.match(/\d{2}\/\d{2}\/\d{4}/);

module.exports = async function ensureAuthenticated(req, res, next) {
    const token = req.headers.authorization;
    const { body } = req;
        const obj = {
            tokenNotFound: !token,
            invalidToken: invalidTokenFunction(token),
            nameRequired: !body.name,
            nameSize: nameSizeFunction(body),
            ageRequired: !body.age,
            legalAge: body.age < 18,
            requiredTalkField: !body.talk,
            requiredRateField: requiredRateFieldFunction(body),
            requiredWatchedAtField: requiredWatchedAtFieldFunction(body),
            rateBetweenOneNFive: rateBetweenOneNFiveFunction(body),
            dateFormat: dateFormatFunction(body),
        };
        const verificate = keyObject.find((key) => obj[key] === true);
        return verificate ? res.status(status(token))
          .json({ message: messageJSON[verificate] }) : next();
};
