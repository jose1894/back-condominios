const { Router } = require( 'express' )
const { check } = require('express-validator')

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require( '../middlewares')

const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators')

const { 
    usuariosGet,
    usuariosPost, 
    usuariosPut, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios')

const router =  Router()

router.get('/', usuariosGet)

router.post('/', [ 
    check( 'fullName', 'El nombre es obligatorio').not().isEmpty(),
    check( 'username', 'El username es obligatorio').not().isEmpty(),
    check( 'password', 'El password debe ser de mas de 6 lentras').isLength({ min: 6}),
    check( 'email' , 'El email no es valido').isEmail(),
    check( 'email' ).custom( existeEmail ),
    check('role', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check( 'role' ).custom( esRolValido ),
    validarCampos
], usuariosPost)

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    check( 'rol' ).custom( esRolValido ),
    validarCampos   
], usuariosPut)

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole( 'ADMIN_ROLE', 'VENTAS_ROLE'),
    check( 'id', 'No es un ID valido').isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    // validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)


module.exports = router