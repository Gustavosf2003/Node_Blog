
//Configurações

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
//const { eAdmin } = require("../helpers/eAdmin")
const usuarios = require("./usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Usuario")
//Rotas




router.get('/posts', (req, res) => {
  res.render("admin/postagens")
})

router.get('/categorias', (req, res) => {


  Categoria.find().sort({ date: 'DESC' }).lean().then((categorias) => {
    res.render("admin/categorias", { categorias: categorias })
}).catch((erro) => {
  req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.redirect("/admin")
})
})


router.get('/categorias/add', (req, res) => {
  res.render("admin/addcategorias")
})




router.post('/categorias/nova', (req, res) => {

  //  //Evitar erros na validação
   var erros = []

   if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
       erros.push({ texto: "Nome inválido" })
   }
   if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
       erros.push({ texto: "Slug inválido" })
   }
   if (req.body.nome.length < 2) {
       erros.push({ texto: "Nome pequeno" })
   }
   if (req.body.slug.length < 2) {
    erros.push({ texto: "Slug pequeno" })
}

   if (erros.length > 0) {
       res.render("admin/addcategorias", { erros: erros })
   } else {


    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }
  
    new Categoria(novaCategoria).save().then(() => {
      req.flash("success_msg", "Categoria criada com sucesso!!!")
      res.redirect("/admin/categorias")
    }).catch((erro) => {
  
      req.flash("error_msg", "Houve um erro ao salvar a categoria. Tente novamente!") //passando a mensgame para a variavel global
      res.redirect("/admin/categorias")
    })
   }



})

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {

    res.render("admin/editcategorias", { categoria: categoria })

}).catch((erro) => {
  req.flash("error_msg", "Esta categoria não existe!!")
    res.redirect("/admin/categorias")
})
})


router.post('/categorias/edit', (req, res) => {
 //Evitar erros na validação
 var erros = []










 if (req.body.nome == req.body.nomeH) {
     erros.push({ texto: "Texto igual ao anterior" })

 }
 if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
     erros.push({ texto: "Nome inválido" })
 }
 if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
     erros.push({ texto: "Slug inválido" })
 }
 if (req.body.nome.length < 2) {
     erros.push({ texto: "Nome pequeno" })

 }
 if (req.body.slug.length < 2) {
  erros.push({ texto: "Slug pequeno" })

}





 if (erros.length > 0) {
     res.render("admin/editcategorias", { erros: erros })
 } else {
     let filter = { _id: req.body.id }
     let update = { nome: req.body.nome, slug: req.body.slug }

     Categoria.findOneAndUpdate(filter, update).then(() => {
         req.flash("success_msg", "Categoria atualizada")
         res.redirect('/admin/categorias')
     }).catch(err => {
         req.flash("error_msg", "Erro ao editar categoria")
     })
 }
})



router.post('/categorias/deletar', (req, res) => {


  Categoria.remove({ _id: req.body.id }).then(() => {
    req.flash("success_msg", "Categoria deletada com sucesso!!!")
    res.redirect('/admin/categorias')
}).catch(err => {
  req.flash("error_msg", "Erro ao excluir categoria")
    res.redirect('/admin/categorias')
})



})


router.get('/postagens', (req, res) => {

  Postagem.find().lean().populate("categoria").sort({ data: "DESC" }).then((postagens) => {
    res.render("admin/postagens", { postagens: postagens })

}).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as postagens")
})



})

router.get('/postagens/add', (req, res) => {


  Categoria.find().lean().then((categorias) => {
    res.render("admin/addpostagem", { categorias: categorias })
})


})



router.post('/postagens/nova', (req, res) => {
  var erros = []

  if (req.body.categoria == 0) {
      erros.push({ texto: "Categoria Inválida,tente novamente!!" })
  }


  if (erros.length > 0) {
      res.render("admin/addcategorias", { erros: erros })
  } else {
      const novaPostagem = {
          titulo: req.body.titulo,
          descricao: req.body.descricao,
          conteudo: req.body.conteudo,
          categoria: req.body.categoria,
          slug: req.body.slug
      }

      new Postagem(novaPostagem).save().then(() => {
          req.flash("success_msg", "Postagem realizada com sucesso")
          res.redirect("/admin/postagens")
      }).catch((err) => {
          req.flash("error_msg", "Houve um erro ao realizar postagem")
          res.redirect("/admin/postagens")
      })

  }
})

router.get("/postagens/edit/:id", (req, res) => {

  Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {

    Categoria.find().lean().then((categorias) => {
        res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro")
        res.redirect('/admin/postagens')
    })
})

})



router.post("/postagem/edit", (req, res) => {


  Postagem.findOne({ _id: req.body.id }).then((postagem) => {


    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo
    postagem.categoria = req.body.categoria



    postagem.save().then(() => {

        req.flash("success_msg", "Postagem atualizada")
        res.redirect('/admin/postagens')
    }).catch((abc) => {

        req.flash("error_msg", "Erro Interno" + abc)
        res.redirect('/admin/postagens')
    })
}).catch((erro) => {
    console.log(erro)
    req.flash("error_msg", "Erro ao salvar a edição" + erro)
    res.redirect('/admin/postagens')
})



})


router.post('/postagens/deletar', (req, res) => {
  Postagem.remove({ _id: req.body.id }).then(() => {
    req.flash("success_msg", "Categoria deletada com sucesso!!!")
    res.redirect('/admin/postagens')
}).catch(err => {
    req.flash("error_msg", "Erro ao excluir categoria")
    res.redirect('/admin/postagens')
})
})


router.get('/listausuarios',(req,res)=>{


  Usuario.find().lean().then((usuarios)=>{
    res.render("admin/listaUsuarios",{usuarios:usuarios})
  }).catch((err)=>{
   req.flash("error_msg","Ops.Erro ao listar usuarios" + err)
   res.redirect("/")
  })


  
})


router.get('/listausuarios/:_id',(req,res)=>{




Usuario.findOne({_id:req.params._id}).lean().then((usuario)=>{

if(usuario){
  res.render("admin/meuPerfil",{usuario:usuario})
}else{
  req.flash("error_msg","Ops.Erro interno" + err)
  res.redirect("/usuarios")
}

}).catch((err)=>{
  req.flash("error_msg","Ops.Erro interno" + err)
    res.redirect("/usuarios")
})

      
   





  
})


 //erro aqui
router.post('/listausuarios/deletar', (req, res) => {
  

      Usuario.remove({ _id: req.body.id }).then(() => {
    req.flash("success_msg", "Usuario deletado com sucesso!!!")
    res.redirect('/admin/listausuarios')
}).catch(err => {
  req.flash("error_msg", "Erro ao excluir categoria")
    res.redirect('admin/listausuarios')
})


 
        })



module.exports = router