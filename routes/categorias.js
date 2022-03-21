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
    categoriasPost, 
    categoriasGet, 
    categoriaGet, 
    categoriaPut, 
    categoriaDelete} = require('../controllers/categorias')

const { existeCategoriaPorId, existeEmail } = require('../helpers/db-validators')
const { Categoria } = require('../models')

const router =  Router()


//Obtener todas las categorias - publico
router.get( '/', categoriasGet )

// Obtener una categoria - publico
router.get( '/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],
categoriaGet)

//Crear categoria - privado - Cualquier persona con token
router.post( '/', [
    validarJWT,
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    validarCampos
], categoriasPost)

//Actualizar categoria - privado - Cualquier persona con token
router.put( '/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'id' ).custom( existeCategoriaPorId ),
    validarCampos
], categoriaPut)

//Borrar una categoria - Admin
router.delete( '/:id',[
    validarJWT,    
    check('id', 'No es un ID valido').isMongoId(),
    check( 'id' ).custom( existeCategoriaPorId ),
    validarCampos 
], categoriaDelete)



module.exports = router