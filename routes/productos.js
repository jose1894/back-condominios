const { Router } = require( 'express' )
const { check } = require('express-validator')
const validator = require('validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require( '../middlewares')

const { 
    productosPost, 
    productosGet, 
    productoGet, 
    productoPut, 
    productoDelete} = require('../controllers/productos')

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators')

const router =  Router()


//Obtener todas las productos - publico
router.get( '/', productosGet )

// Obtener una producto - publico
router.get( '/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
],
productoGet)

//Crear producto - privado - Cualquier persona con token
router.post( '/', [
    validarJWT,
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check('categoria', 'La categoria no es un ID valido').isMongoId(),
    check( 'categoria' ).custom( existeCategoriaPorId ),
    validarCampos
], productosPost)

//Actualizar producto - privado - Cualquier persona con token
router.put( '/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('categoria', 'La categoria no es un ID valido').isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    check( 'categoria' ).custom( existeCategoriaPorId ),
    validarCampos
], productoPut)

//Borrar una producto - Admin
router.delete( '/:id',[
    validarJWT,    
    check('id', 'No es un ID valido').isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    validarCampos 
], productoDelete)



module.exports = router