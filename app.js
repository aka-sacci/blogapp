//DEPENDÊNCIAS
const express = require('express')
const { engine, } = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const port = 8081;
const Postagens = require("./models/Postagem")
const postagem = Postagens.model("postagens")
const Categorias = require("./models/Categoria")
const categoria = Categorias.model("categorias")
const passport = require("passport")

require('./config/auth')(passport)

//CONFIG
    //Session
    app.use(session({
        secret: "blog-node",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    //Middleware
    app.use((req, res, next) => {
        res.locals.successMsg = req.flash("successMsg")
        res.locals.errorMsg = req.flash("errorMsg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })

    //Body Parser
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

    //Handlebars
    app.set('view engine', 'handlebars')
    app.engine('handlebars', engine({defaultLayout: 'main'}))
    
    //Mongoose
    const mongo = require('./models/db')

    //Pasta Public
    app.use(express.static(path.join(__dirname, "public")))
    

//ROTAS
    //admin
    const adminRoute = require('./routes/adminRoutes')
    adminRoute(app)

    //Posts
    const postRoute = require('./routes/postRoutes')
    postRoute(app)

    //Usuários
    const userRoute = require('./routes/userRoutes')
    userRoute(app)
    //Main
    app.get("/", (req, res) => {
        //Faz o select das postagens
        postagem.find().lean().populate("categoria").sort({date: "ASC"})
        .then((result) => {
            res.render("index", {
                posts: result
            })
        }).catch((err) => {
            req.flash("errorMsg", "Houve um erro interno: " + err)
            res.redirect("/404")
        })
    })

    //404
    app.get("/404", (req, res) => {
        res.send("Erro 404")
    })

    //categorias
    app.get("/categorias", (req, res) => {
        categoria.find().lean()
        .then((result) => {
            res.render("categorias/index", {
                categorias : result
            })
        }).catch((err) => {
            req.flash("errorMsg", "Houve um erro ao listar as categorias")
            res.redirect("/")
        })
    })

    //Listagem dos posts de categoria específica

    app.get("/categorias/:slug", (req, res) => {
    
    //pega o id da categoria passada pelo Slug, depois faz o select dos posts
      categoria.findOne({slug : req.params.slug}).lean()
      .then((categoriaSelecionada) => {
        //faz o select dos posts
        if(categoriaSelecionada){
        postagem.find({categoria: categoriaSelecionada._id})
            .lean()
                .sort({date: "desc"})
                    .then((postagensCategoria) => {
                        //Exibe os posts
                        res.render("categorias/posts", {
                            posts: postagensCategoria,
                            categoria: categoriaSelecionada
                        })
                    })
                    .catch((err) => {
                        req.flash("errorMsg", "Não foi possível recuperar as postagens da categoria " + categoriaSelecionada.nome)
                        res.redirect("/")
                    })
        }  
        else{
        req.flash("errorMsg", "A categoria não existe!")
        res.redirect("/")
        }

      }).catch((err) => {
        req.flash("errorMsg", "Não foi possível recuperar os dados da categoria!")
        res.redirect("/")
      })
    })

    //View post
    app.get("/posts/view/:slug", (req, res) => {
         //Faz o select das postagens
         postagem.findOne({slug: req.params.slug})
            .lean()
                .populate("categoria")
                    .then((result) => {
                        res.render("posts/views/index", {
                        post: result
                        })
                    }).catch((err) => {
                        req.flash("errorMsg", "Houve um erro interno: " + err)
                        res.redirect("/404")
                    })
    })

//OUTROS
app.listen(port, () => console.log("Servidor rodando na porta " + port))