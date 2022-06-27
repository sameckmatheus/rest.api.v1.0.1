const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../../config/auth');

module.exports = async (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(401).json({
            error: true,
            code: 130,
            message: "Token de autenticação não existente!"
        })
    }
    const [, token] = auth.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, config.secret);
        if(!decoded) {
            return res.status(401).json({
                error: true,
                code: 130,
                message: "Token de autenticação expirado!"
            })
        } else {
            req.user_id = decoded.id;
            next();
        }
    } catch {
        return res.status(401).json({
            error: true,
            code: 130,
            message: "Token de autenticação inválido!"
        })
    }
}