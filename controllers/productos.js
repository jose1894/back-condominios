const { response } = require("express");
const  Producto  = require('../models/producto');

// obtenerCategorias - paginado - total - populate

const productosGet = async ( req, res = response) => {

    // try{
        const { limite = 5, desde = 0 } = req.query
        const query = { estado: true}

        // Promise . all envia varias promesas simultaneas
        const [ total, productos ] = await Promise.all([
            Producto.countDocuments( query ),
            Producto.find( query )
                    .populate( 'categoria' )
                    .populate( 'usuario' )
                    .skip( +desde )
                    .limit( +limite )
        ])

        res.send({
            total,
            productos
        })

    // } catch ( error ) {
    //     console.log( error )

    //     return res.status( 500 ).json({
    //         msg: `Error del servidor al mostrar los productos ${ error }`
    //     })
    // }

}

// obtenerCategoria - populate {}
const productoGet = async ( req, res = response ) => {

    try{

        const { id } = req.params

        const producto = await Producto.findById( id ).populate( 'usuario' ).populate( 'categoria' )

        return res.status(200).send(
            producto
        )

    } catch ( error ) {
        console.log( error )

        return res.status( 500 ).json({
            msg: `Error del servidor al mostrar los producto ${ error }`
        })
    }
}


const productosPost = async ( req, res = response ) => {

    try {

        const { estado, usuario, body }  = req

        const productoDB = await Producto.findOne( { nombre: body.nombre } )

        if ( productoDB ) {
            return res.status( 400 ).json({
                msg: `El producto ${ productoDB.nombre } ya existe`
            })
        }

        // console.log( body )

        const data = {
            ...body,
            categoria: body.categoria,
            nombre: body.nombre.toUpperCase(),
            usuario: usuario._id,
        }

        const producto = new Producto( data )

        //Guardar en DB
        await producto.save()

        return res.status( 201 ).json(producto)

    } catch ( error ) {
            console.log( error )

            return res.status( 500 ).json({
                msg: `Error del servidor al guardar un producto ${ error }`
            })

    }
} 

// actualizarCategoria 
const productoPut = async ( req, res = response ) => {

    try{

        const { id } = req.params

        const { estado, usuario, ...data } = req.body

        data.nombre = data.nombre.toUpperCase()
        data.usuario = req.usuario._id 

        const producto = await Producto.findByIdAndUpdate( id, data, { new:true })

        return res.status(200).send(
            producto
        )

        

    } catch ( error ) {
        console.log( error )

        return res.status( 500 ).json({
            msg: `Error del servidor al mostrar los productos ${ error }`
        })
    }
}

// borrarCategoria - estado : false
const productoDelete = async ( req, res = response ) => {

    const { id } = req.params
    const producto = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true})

    res.json( producto )
}

module.exports = {
    productosPost,
    productosGet,
    productoGet,
    productoPut,
    productoDelete
}