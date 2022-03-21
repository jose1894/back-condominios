const { response } = require("express");
const Categoria  = require('../models/categoria')

// obtenerCategorias - paginado - total - populate

const categoriasGet = async ( req, res = response) => {

    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { estado: true}

        // Promise . all envia varias promesas simultaneas
        const [ total, categorias ] = await Promise.all([
            Categoria.countDocuments( query ),
            Categoria.find( query )
                    .populate( 'usuario' )
                    .skip( +desde )
                    .limit( +limite )
        ])

        res.send({
            total,
            categorias
        })

    } catch ( error ) {
        console.log( error )

        return res.status( 500 ).json({
            msg: `Error del servidor al mostrar las categorias ${ error }`
        })
    }

}

// obtenerCategoria - populate {}
const categoriaGet = async ( req, res = response ) => {

    try{

        const { id } = req.params

        const categoria = await Categoria.findById( id ).populate( 'usuario' )

        return res.status(200).send(
            categoria
        )

    } catch ( error ) {
        console.log( error )

        return res.status( 500 ).json({
            msg: `Error del servidor al mostrar las categorias ${ error }`
        })
    }
}


const categoriasPost = async ( req, res = response ) => {


    try {
        const nombre = req.body.nombre.toUpperCase()

        const categoriaDB = await Categoria.findOne( { nombre } )

        if ( categoriaDB ) {
            return res.status( 400 ).json({
                msg: `La categoria ${ categoriaDB.nombre } ya existe`
            })
        }

        const data = {
            nombre,
            usuario: req.usuario._id
        }

        const categoria = new Categoria( data )

        //Guardar en DB
        await categoria.save()

        return res.status( 201 ).json(categoria)

    } catch ( error ) {
            console.log( error )

            return res.status( 500 ).json({
                msg: `Error del servidor al guardar una categoria ${ error }`
            })

    }
} 

// actualizarCategoria 
const categoriaPut = async ( req, res = response ) => {

    try{

        const { id } = req.params

        const { estado, usuario, ...data } = req.body

        data.nombre = data.nombre.toUpperCase()
        data.usuario = req.usuario._id 

        const categoria = await Categoria.findByIdAndUpdate( id, data, { new:true })

        return res.status(200).send(
            categoria
        )

    } catch ( error ) {
        console.log( error )

        return res.status( 500 ).json({
            msg: `Error del servidor al mostrar las categorias ${ error }`
        })
    }
}

// borrarCategoria - estado : false
const categoriaDelete = async ( req, res = response ) => {

    const { id } = req.params
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false}, { new: true})

    res.json( categoria )
}

module.exports = {
    categoriasPost,
    categoriasGet,
    categoriaGet,
    categoriaPut,
    categoriaDelete
}