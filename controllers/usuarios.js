
const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const  Usuario  = require('../models/usuario')

const usuariosGet = async (req = request, res) => {

    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { estado: true}

        // Promise . all envia varias promesas simultaneas
        const [ total, usuarios ] = await Promise.all([
            Usuario.countDocuments( query ),
            Usuario.find( query )
                    .skip( +desde )
                    .limit( +limite )
        ])

        res.send({
            total,
            usuarios
        })
    } catch (error) {
        throw new Error(error)
    }
}

const usuariosPost = async (req, res) => {

    const { fullName, username, email, password, role } = req.body
    const usuario = new Usuario( { fullName, username, email, password, role } )

    // Cifrar la contrasena
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt)

    await usuario.save()

    res.send({
        usuario
    })
}

const usuariosPut = async (req, res) => {

    const { id } = req.params
    const { _id, password, google, email, ...resto } = req.body

    // TODO: Validar contra BBDD
    if ( password ) {
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto)

    res.send({
        usuario
    })
}

const usuariosPatch = (req, res) => {
    res.send({
        msg: "PATCH api - controlador"
    })
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false} )

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}