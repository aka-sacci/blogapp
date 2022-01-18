//Importação de módulos necessários
const Categorias = require("../models/Categoria")
const categoria = Categorias.model("categorias")
const isAdminHelper = require("../helpers/isAdmin")

//Funções úteis
const validateCategory = (body) => {
    var errors = [];

    if(!body.nome || typeof body.nome == undefined || body.nome == null){
        errors.push({texto: "Nome inválido"})
    }

    if(!body.slug || typeof body.slug == undefined || body.slug == null){
        errors.push({texto: "Slug inválido"})
    }
    return errors.length > 0 ? errors : false
}

//Rotas
const adminRoute = (app) => {
    //ROTA PRINCIPAL
    app.get("/admin", isAdminHelper, (req, res) => {
        res.render("admin/index")
    })

    //ROTA DE VIEW DE CATEGORIAS
    app.get("/admin/categorias", isAdminHelper, (req, res) => {
        categoria.find().sort({date: "desc"}).lean()
        .then((result) => {
            res.render("admin/categorias",  {
                categorias: result
            })
        })
        .catch((err) => {
            req.flash("errorMsg", "Erro ao recuperar os dados das categorias!")
            res.redirect("/admin")
        })
    })

    //ROTA DE CADASTRO DE CATEGORIAS
    app.get("/admin/categorias/add", isAdminHelper, (req, res) => {
        res.render("admin/addcategoria")
    })

    //ROTA QUE FAZ A INSERÇÃO DE CATEGORIAS
    app.post("/admin/categorias/add/action", isAdminHelper, (req, res) => { 

        const validation = validateCategory(req.body)
        validation ? res.render("admin/addcategoria", {errors: validation}) : 
           
        new categoria({
            nome: req.body.nome,
            slug: req.body.slug
        })
        .save()
        .then(() => {
            req.flash("successMsg", "Categoria criada com sucesso")   
            res.redirect("/admin/categorias")
        })
        .catch((err) => {
            req.flash("errorMsg", "Houve um erro ao inserir a categoria: " + err) 
            res.redirect("/admin")
        })
    })

    //ROTA DE EDIÇÃO DE CATEGORIAS
    app.get("/admin/categorias/edit/:id", isAdminHelper, (req, res) => {
        //res.send(req.params.id)
        categoria.findOne({_id: req.params.id}).lean()
        .then((result) => {
            res.render("admin/editcategoria",  {
                categorias: result
            })
        })
        .catch((err) => {
            req.flash("errorMsg", "Erro ao recuperar os dados da categoria " + req.params.id + ": " + err)
            res.redirect("/admin")
        })
    })

    //ROTA QUE EDITA AS CATEGORIAS
    app.post("/admin/categorias/edit/action", isAdminHelper, (req, res) => {
        //Valida a intel
        const validation = validateCategory(req.body)
        validation ? res.render("admin/editcategoria", {errors: validation, categorias: req.body}) : 

        //Procura se o registro existe
        categoria.findOne({_id: req.body._id})
        .then((result) => {
            //faz a alteração
            result.nome = req.body.nome
            result.slug = req.body.slug

            result
            .save()
                .then(() => {
                    req.flash("successMsg", "Categoria alterada com sucesso!")    
                    res.redirect("/admin/categorias")
            })
            .catch((err) => {
                req.flash("errorMsg", "Erro ao alterar a categoria: " + err)    
                res.redirect("/admin/categorias")
            })
        })
        .catch((err) => {
            req.flash("errorMsg", "Erro ao procurar os dados da categoria " + req.params.id + ": " + err)
            res.redirect("/admin")
        })

    })

    //Rota de deleção de categoria
    app.post("/admin/categorias/delete", isAdminHelper, (req, res) => {
        categoria.deleteOne({_id: req.body._id})
        .then(() => {
            req.flash("successMsg", "Categoria '" + req.body.confirmDelete + "' excluída com sucesso!")    
            res.redirect("/admin/categorias")
        })
        .catch(() => {
            req.flash("errorMsg", "Erro ao excluir a categoria " + req.body.confirmDelete + ": " + err)
            res.redirect("/admin")
        })

    })
    
}

module.exports = adminRoute;