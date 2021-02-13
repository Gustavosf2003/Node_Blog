//Configurações

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
//const passport = require("passport")
router.use(express.static('views/images'));


router.get("/registro", (req, res) => {


    res.render("usuarios/registro")

})


router.post("/registro", (req, res) => {

    var erros = [];


    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email inválido" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválida" })
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha curta demais" })
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "OPS!! As senhas estão diferentes" })
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", { erros: erros })
    } else {
        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Hmmm... Já existe uma conta com esse email")
                res.redirect("/usuarios/registro")
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    idade:req.body.idade,
                    descricao:req.body.descricao,
                    localizacao:req.body.localizacao,
                    sexo:req.body.sexo,
                    senha: req.body.senha,
                    
                    //eAdmin:1 para cadastrar um admin
                })

                //Encriptar a senha

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro ao salvar o usuário")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {

                            req.flash("success_msg", "Usuário cadastrado com sucesso!!!")
                            res.redirect("/");



                        }).catch((error) => {
                            req.flash("error_msg", "Houve um erro interno e nao conseguimos cadastrar " + error)
                        })
                    })
                })


            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }

})








router.get("/login", (req, res) => {

    res.render("usuarios/login")

})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/categorias",
        failureFlash: true
    })(req, res, next)

})

module.exports = router

