module.exports = async function deleteAuthenticated(req, res, next) {
    const token = req.headers.authorization;
    const verificateToken = {
        tokenNotFound: !token,
        invalidToken: token && (token.length < 16 || token.length > 16),
    };
    const messageJSON = {
        tokenNotFound: 'Token não encontrado',
        invalidToken: 'Token inválido',
    };
    const keyObject = ['tokenNotFound', 'invalidToken'];
    const verificate = keyObject.find((key) => verificateToken[key] === true);
    return verificate ? res.status(401).json({ message: messageJSON[verificate] }) : next();
};