const loginValidation = (req, res, next) => {
    const login = req.body;
    const messageJSON = {
        emailObrigatorio: 'O campo "email" é obrigatório',
        emailFormato: 'O "email" deve ter o formato "email@email.com"',
        passwordObrigatorio: 'O campo "password" é obrigatório',
        passwordTamanho: 'O "password" deve ter pelo menos 6 caracteres',
    };

    const obj = {
      emailObrigatorio: !login.email,
      emailFormato: login.email && !login.email.match(/.*@.*\.com/),
      passwordObrigatorio: !login.password,
      passwordTamanho: login.password && (login.password.length > 0 && login.password.length < 6),
  };

  const keyObject = ['emailObrigatorio', 'emailFormato', 'passwordObrigatorio', 'passwordTamanho'];
  const verificate = keyObject.find((key) => obj[key] === true);
    return verificate ? res.status(400).json({ message: messageJSON[verificate] }) : next();
};

module.exports = loginValidation;
