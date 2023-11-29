import { Router } from 'express';
import { generateAccessToken, validateToken } from '../utils/token.mjs';
import { validateLogin, consultEmailUser } from '../models/loginModel.mjs';
import { createUser, showOneUser, showUsers, deleteUser, updateUser } from '../models/userModel.mjs';
import { sendEmailRecoveryPassword } from '../utils/mail.mjs';
import { showMedicines, showReminder } from '../models/medicineModel.mjs';
import generateQR  from '../utils/generateQR.mjs';

const router = Router();

/*------- PRUEBAS ------- */
router.get('/', async (req, res) => {

});


/*------- LOGIN ------- */
// Autenticacion de usuario
router.get('/login', async (req, res) => {

    try {

        const { usuario, password } = req.body;
        const querySnapshot = await validateLogin(usuario, password);
        // returna mensaje de error si no encuentra el usuario
        if(querySnapshot.docs[0] === undefined) return res.send('Usuario o contraseña incorrectos');
        // Generar token
        const accesToken = generateAccessToken(usuario);
        // Se envia el token en el header
        res.set('auth-token', accesToken).send({ message: 'Usuario corrercto', token: accesToken });

    } catch (error) {
        console.log(error);
    }
});


router.get('/recovery-password/:email', async (req, res) => {
    try {
        
        const querySnapshot = await consultEmailUser(req.params.email);
        if( querySnapshot === false ) return res.send({ message: 'El usuario no existe' });
        sendEmailRecoveryPassword(req.params.email);
        res.send({ message: 'Correo enviado' })

    } catch (error) {
        console.log({ message: error });
    }
});

/* ------- MEDICINAS ------- */
// Consulta medicinas
router.get('/medicines', validateToken, async (req, res) => {
    try {
        const querySnapshot = await showMedicines();
        const medicines = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.send({ message: 'Consulta de recordatorios realizada', medicines });
    } catch (error) {
        console.log(error);
    }
});

// Consulta recordatorios
router.get('/reminder', validateToken, async (req, res) => {
    try {
        const querySnapshot = await showReminder();
        const reminders = querySnapshot.docs.map(doc => {
            let init = doc.data().init.toDate();
            let end = doc.data().end.toDate(); 
            return {
                id: doc.id,
                ...doc.data(),
                init: getYear(init) + '-' + getMonth(init) + '-' + getDay(init),
                end: getYear(end) + '-' + getMonth(end) + '-' + getDay(end),
            }
        });

        const date = new Date(reminders[0].init)
        console.log(date);

        res.send({ message: 'Consulta de recordatorios realizada', reminders });
    } catch (error) {
        console.log(error);
    }
});


// Creacion de recordatorio
router.post('/new-reminder',async (req, res) => {
    try {
        
        const { user_id, med_id, fecha} = req.body;
       
        console.log(`user_id: ${user_id}, med_id: ${med_id}, fecha: ${fecha}`);

        // Llamar al modelo
        /*const data = await createReminder({
            user_id,
            med_id,
            fecha
        });*/

        //console.log(data);

        res.send({ message: 'Recordatorio creado' });

    } catch (error) {
        console.log(error);
    }
});

/*------- USUARIOS ------- */
// Consulta de usuarios
router.get('/users' ,async (req, res) => {

    try {

        // El querySnapshot es la respuesta de la base de datos
        const querySnapshot = await showUsers();
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.send({ message: 'Consulta de usuarios realizada', users });

    } catch (error) {
        console.log(error);        
    }
})

// Creacion de usuario
router.post('/new-user', async (req, res) => {
    try {

        const { apellido, condicion, correo, foto, nombre, password, responsable, telefono, usuario } = req.body
        // Llamar al modelo
        await createUser({
            apellido,
            condicion,
            correo,
            foto,
            nombre,
            password,
            responsable,
            telefono,
            usuario
        });
        res.send({ message: 'Usuario creado' });

    } catch (error) {
        console.log(error);
    }
})

// Edicion de usuario
router.get('/search-user/:id' ,async (req, res) => {
    try {
        
        // Consulta a un solo user
        const response = await showOneUser(req.params.id);
        const data = await generateQR( JSON.stringify(response.data()) )
        console.log(data);
        res.send({ message: 'Usuario encontrado', user: response.data() });

    } catch (error) {
        console.log(error);
    }
});

// Eliminacion de un usuario
router.get('/delete-user/:id', async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.send({ message: 'Usuario eliminado' });
    } catch (error) {
        console.log(error);
    }
});

// Actualizacion de un usuario
router.post('/update-user/:id', async (req, res) => {
    try {

        await updateUser(req.params.id, req.body);
        res.send({ message: 'Usuario actualizado' });

    } catch (error) {
        console.log(error);
        
    }
});


export default router;

