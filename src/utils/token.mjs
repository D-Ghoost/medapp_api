import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

const secretKey = process.env.SECRET_KEY

function generateAccessToken(user) {

    // El token se genera con la informacion del usuario y la clave secreta
    return jsonwebtoken.sign({ data: user }, secretKey, { expiresIn: '10m' });
}

// Validación del token
function validateToken(req, res, next) {
    const accesToken = req.header('auth-token');
    console.log(accesToken);
    if(!accesToken) res.send('Lo siento, necesitas un token');

    jsonwebtoken.verify(accesToken, secretKey, (err, user) => {
        if(err){
            res.send('Token no valido');
        }else{
            next();
        }
    })
}

export { generateAccessToken, validateToken };