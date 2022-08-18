const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = {
            uid
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('cannot generate token');
            } else {
                resolve(token);
            }
        });
    })

}

const checkJwt = async (token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid); 
        if (usuario) {
            if (usuario.estado) {
                return usuario;
            }
            return null;
        }
        return null;

    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports = {
    generateJWT,
    checkJwt
}