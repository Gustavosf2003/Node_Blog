//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require("path")
const mongoose = require ("mongoose")
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const Usuario = mongoose.model("usuarios")
require("./models/Usuario")


//configurações

//Sessão
app.use(session({
  secret:"Curso de Node",// qualquer coisa
  resave: true,
  saveUninitialized:true
}))
app.use(flash())

//Middleware

app.use((req,res,next) =>{
  res.locals.success_msg= req.flash("success_msg");
  res.locals.error_msg= req.flash("error_msg");
  next()
})

//Body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars',handlebars({defaultLayout:'main'}))
app.set('view engine','handlebars')

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/NodeBlog").then(()=>{
  console.log("Conectado ao mongo db")
}).catch((err)=>{
  console.log("erro:" + err)
})


//Referenciando bootstrap e arquivos externos

app.use(express.static(path.join(__dirname,"public")))

//rotas



app.get('/',(req,res)=>{
  Postagem.find().sort({data:'desc'}).populate('categoria').lean().then((postagens)=>{
    res.render("index",{postagens:postagens})
}).catch((err)=>{
    req.flash("error_msg","Ops. HOuve o erro :" + err)
    res.redirect("/404")
})
})

app.get('/postagem/:slug',(req,res)=>{

  Postagem.findOne({slug:req.params.slug}).lean().then((postagem)=>{
    if(postagem){
      res.render("postagem/index", {postagem:postagem})
    }else{
      req.flash("error_msg","Ops. Essa pagina nao existe:" + err)
      res.redirect("/")
    }
  }).catch((err)=>{
    req.flash("error_msg","Ops.Erro interno" + err)
      res.redirect("/")
  })
  
})





app.get('/categorias',(req,res)=>{
 Categoria.find().lean().then((categorias)=>{
   res.render("categorias/index",{categorias:categorias})
 }).catch((err)=>{
  req.flash("error_msg","Ops.Erro ao listar categorias" + err)
  res.redirect("/")
 })
})


app.get('/categorias/:slug',(req,res)=>{

  Categoria.findOne().lean().then((categoria)=>{
    if(categoria){
      Postagem.find({categoria:categoria._id}).lean().then((postagens)=>{
        res.render("categorias/postagens",{postagens:postagens,categoria:categoria})
      })
    }else{
      req.flash("error_msg","Ops.Essa categoria nao existe" + err)
      res.redirect("/")
    }
  }).catch((err)=>{
    req.flash("error_msg","Ops.Erro interno" + err)
      res.redirect("/")
  })
  
})



 










app.use('/admin',admin)
app.use('/usuarios',usuarios)

app.get('/404',(req,res)=>{
  res.send("Erro 404")
})


//outros

const PORT = 1234
app.listen(PORT,()=>{
console.log("Servidor rodando na porta: " + PORT)
})