const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({

    nome: {
        type: String,
        required: true
    },

  
    email: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    localizacao: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },




})

mongoose.model("usuarios", Usuario)