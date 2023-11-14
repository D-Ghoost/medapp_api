import { db } from '../config/firebase-config.mjs';

function showMedicines() {
    return db.collection('medicine').get();
}

export { showMedicines };