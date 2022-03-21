const bcryptjs = require('bcryptjs')
const { response } = require('express')
const { json } = require('express/lib/response')
const { generarJWT, generarRefreshJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')
const Usuario = require('../models/usuario')

const login = async ( req, res = response) => {

    const { email, password } = req.body 

    try{
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email })

        if ( !usuario ){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - email"
            })
        }

        // Si el usuario esta activo
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: false"
            })
        }

        // Verificar la contrasena
        const validPassword = bcryptjs.compareSync( password, usuario.password )
        if ( !validPassword ){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - password"
            })
        }

        // Generara JWT
        const token = await generarJWT( usuario.id )

        const refreshToken = await generarRefreshJWT( usuario.id )

        res.json({
            userData: usuario,
            accessToken: token,
            refreshToken
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response ) => {

    const { id_token } = req.body

    try {
        const { nombre, img, email } = await googleVerify( id_token )
        
        let usuario = await Usuario.findOne({ email })
        
        if ( !usuario ) {
            // Crear usuario
            const data = {
                fullName,
                email,
                password: 'xxx',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario( data )

            await usuario.save()
        }

        // Si el usuario en DB 

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, uaurio bloqueado'
            })
        }

        // Generara JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}