//Importação de módulos necessários
const Postagens = require("../models/Postagem")
const postagem = Postagens.model("postagens")
const Categorias = require("../models/Categoria")
const categoria = Categorias.model("categorias")
const isAdminHelper = require("../helpers/isAdmin")

//Funções úteis
const validateForm = (body) => {
    var errors = [];

    if(!body.titulo || typeof body.titulo == undefined || body.titulo == null){
        errors.push({texto: "Título inválido!"})
    }

    if(!body.slug || typeof body.slug == undefined || body.slug == null){
        errors.push({texto: "Slug inválido!"})
    }

    if(!body.descricao || typeof body.descricao == undefined || body.descricao == null){
        errors.push({texto: "Descrição inválida!"})
    }

    if(!body.conteudo || typeof body.conteudo == undefined || body.conteudo == null){
        errors.push({texto: "Conteúdo inválido!"})
    }

    if(!body.categoria || typeof body.categoria == undefined || body.categoria == null){
        errors.push({texto: "Categoria inválida! Cadastre uma categoria!"})
    }

    return errors.length > 0 ? errors : false
}

const postRoute = (app) => {

    //Rota principal
    app.get("/posts", isAdminHelper, (req, res) => {
        postagem.find().lean().populate("categoria").sort({date: "desc"})
        .then((result) => {
            res.render("posts/index",  {
                posts: result
            })
        })
        .catch((err) => {
            res.render("posts/index")
        })

    })

    //Rota de adicionar posts
    app.get("/posts/add", isAdminHelper, (req, res) => {
        categoria.find().sort({date: "desc"}).lean()
        .then((result) => {
            res.render("posts/addpost",  {
                categorias: result
            })
        })
        .catch((err) => {
            req.flash("errorMsg", "Erro ao recuperar os dados das categorias! Tente novamente mais tarde")
            res.redirect("/posts")
        })
    })

    //Rota ACTION para adicionar posts
    app.post("/posts/add/action", isAdminHelper, (req, res) => {
        //Checka a consistência dos dados
        const validation = validateForm(req.body)
        validation ? res.render("posts/addpost", {errors: validation}) :

        //faz a inserção
        new postagem({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        })
        .save()
        .then(() => {
            req.flash("successMsg", "Postagem criada com sucesso!")   
            res.redirect("/posts")
        })
        .catch((err) => {
            req.flash("errorMsg", "Houve um erro ao criar o post: " + err) 
            res.redirect("/posts")
        })
    })

    //Rota de deleção de postagens
    app.post('/posts/delete', isAdminHelper, (req, res) => {
        postagem.deleteOne({_id: req.body._id})
        .then(() => {
            req.flash("successMsg", "Postagem '" + req.body.confirmDelete + "' excluído com sucesso!")    
            res.redirect("/posts")
        })
        .catch((err) => {
            req.flash("errorMsg", "Erro ao excluir o post " + req.body.confirmDelete + ": " + err)
            res.redirect("/posts")
        })
    })

    //rota de edição de postagem
    app.get("/posts/edit/:id", isAdminHelper, (req, res) => {
        postagem.findOne({
            _id: req.params.id
        }).lean().populate("categoria")
        .then((Post) => {
                categoria.find().sort({date: "desc"}).lean()
                    .then((Categorias) => {
                        res.render("posts/editpost", {
                            post: Post,
                            categorias: Categorias
                        })
                    })
        .catch((err) => {
            req.flash("errorMsg", "Erro ao recuperar os dados das categorias! Tente novamente mais tarde")
            res.redirect("/posts")
        })

        }).catch((err) => {
            req.flash("errorMsg", "Erro ao recuperar os dados do post!")
            res.redirect('/posts')
        })
    })

    app.post("/posts/edit/action", isAdminHelper, (req, res) => {

         //Procura se o registro existe
         postagem.findOne({_id: req.body._id})
         .then((result) => {
             //faz a alteração
             result.titulo = req.body.titulo
             result.slug = req.body.slug
             result.descricao = req.body.descricao
             result.conteudo = req.body.conteudo
             result.categoria = req.body.categoria
             result
             .save()
                 .then(() => {
                     req.flash("successMsg", "Postagem alterada com sucesso!")    
                     res.redirect("/posts")
             })
             .catch((err) => {
                 req.flash("errorMsg", "Erro ao alterar a postagem: " + err)    
                 res.redirect("/posts")
             })
         })
         .catch((err) => {
             req.flash("errorMsg", "Erro ao recuperar os dados da postagem " + req.params.id + ": " + err)
             res.redirect("/posts")
         })
    })

}

module.exports = postRoute;