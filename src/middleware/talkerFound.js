const fs = require('fs/promises');
const path = require('path');

const pathTalkers = path.resolve(__dirname, '..', 'talker.json');

module.exports = async function talkerFound(req, res, next) {
    const { id } = req.params;
    const talkers = JSON.parse(await fs.readFile(pathTalkers));
    const idTalker = talkers.find((item) => item.id === +(id));
    if (!idTalker) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    next();
};