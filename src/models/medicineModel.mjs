import { db } from '../config/firebase-config.mjs';

function showMedicines() {
    return db.collection('medicine').get();
}

function createReminder(data) {
    return db.collection('agenda').add(data);
}

function showReminder() {
    return db.collection('agenda').get();
}

export { showMedicines, showReminder, createReminder };