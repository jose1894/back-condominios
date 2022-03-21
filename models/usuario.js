
const { Schema, model } = require('mongoose')


const UserSchema = Schema({
    fullName: {
        type: String,
        required: [ true, 'El nombre es obligatorio']
    },
    username: {
        type: String,
        required: [ true, 'El username es obligatorio']
    },
    email: {
        type: String,
        required: [ true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'El correo es obligatorio']
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default:false
    },
})

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject()

    usuario.id = _id

    return usuario
}

module.exports = model( 'Usuario', UserSchema )