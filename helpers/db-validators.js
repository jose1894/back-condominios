const { Categoria, Usuario, Role, Producto } = require('../models')


const esRolValido = async ( rol = '' ) => {
    const existeRol = await Role.findOne({ rol })
    
    if ( !existeRol ){
        throw new Error(` El rol ${role} no esta agregado en la base de datos`)
    }

}

// Verificar que el correo existe
const existeEmail = async ( email = '' ) => {

    const existe = await Usuario.findOne({ email })

    if ( existe ) {
        throw new Error( `El correo ${ email } ya esta registrado`)
    }
}

const existeUsuarioPorId = async ( id ) => {

    const existe = await Usuario.findById({ id })

    if ( !existe ) {
        throw new Error( `El id ${ id } no existe`)
    }
}

const existeCategoriaPorId = async ( id ) => {
    const existe = await Categoria.findById( id )
    // console.log( existe )
    
    if ( !existe ) {
        throw new Error( `El id ${ id } no existe`)
    }
}

const existeProductoPorId = async ( id ) => {
    const existe = await Producto.findById( id )
    // console.log( existe )
    
    if ( !existe ) {
        throw new Error( `El id ${ id } no existe`)
    }
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = ( coleccion = '', coleccionesPermitidas = []) => {
    const incluida = coleccionesPermitidas.includes( coleccion )

    if (!incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida - ${ coleccionesPermitidas }`)
    }

    return true
}

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}