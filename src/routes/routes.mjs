import { Router } from 'express';
import { generateAccessToken, validateToken } from '../utils/token.mjs';
import { validateLogin, consultEmailUser } from '../models/loginModel.mjs';
import { createUser, showOneUser, showUsers, deleteUser, updateUser } from '../models/userModel.mjs';
import { sendEmailRecoveryPassword } from '../utils/mail.mjs';
import { showMedicines } from '../models/medicineModel.mjs';
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

