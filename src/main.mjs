// Inicio de la app
import app from './config/app.mjs';
import './config/firebase-config.mjs'
import dotenv from 'dotenv';




dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${ PORT }`);
});