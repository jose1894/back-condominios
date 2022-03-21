const { Router } = require( 'express' )
const { check } = require('express-validator')
const { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers')
const { validarArchivoSubir } = require('../middlewares/validar-archivo')
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router()

router.post( '/', validarArchivoSubir , cargarArchivo )

router.put( '/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser un id de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos']) ),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
        check('id', 'El id debe ser un id de Mongo').isMongoId(),
        check('coleccion').custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos']) ),
        validarCampos
], mostrarImagen)

module.exports = router