// init firebase
import dotenv from "dotenv";
import { initializeApp  } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage, getDownloadURL  } from "firebase-admin/storage"

dotenv.config();


const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

initializeApp(config)

const db = getFirestore();

const storage = getStorage();

// Cambiar el numero 3 por el numero de imagenes que se quieran descargar
const imagesPills = [];
for (let j = 1; j <= 3; j++) {
    const reference = storage.bucket().file(`pills/pill_${ j }.png`);
    const url = await getDownloadURL(reference); 
    imagesPills.push(url);  
}

console.log(imagesPills);

export { db, imagesPills };
