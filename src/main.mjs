// Inicio de la app
import app from './config/app.mjs';
import './config/firebase-config.mjs'
import dotenv from 'dotenv';
import ngrok from 'ngrok';



dotenv.config();


const PORT = process.env.PORT || 3000;

if (process.env.APP === ) {
    
}

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${ PORT }`);
});