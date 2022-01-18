//Importação de módulos necessários
const Usuarios = require("../models/Usuario")
const usuario = Usuarios.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Funcões úteis
const validateForm = (body) => {
    var errors = [];

    if(!body.nome || typeof body.nome == undefined || body.nome == null){
        errors.push({texto: "Nome inválido!"})
    }

    if(!body.email || typeof body.email == undefined || body.email == null){
        errors.push({texto: "Email inválido!"})
    }

    if(!body.senha || typeof body.senha == undefined || body.senha == null){
        errors.push({texto: "Senha inválida!"})
    }

    return errors.length > 0 ? errors : false
}

//rotas
const userRoutes = (app) => {

    app.get("/user/registro", (req, res) => {
        res.render("users/registro")
    })

    app.post("/user/registro/action", (req, res) => {
        const validation = validateForm(req.body)
        validation ? res.render("users/registro", {errors: validation}) :
        //Checka se há algum usuário com mesmo email
        usuario.findOne({email: req.body.email})
            .then((result) => {
                if(result){
                    //Se tiver um usuário cadastrado com o mesmo email, dá erro
                    req.flash("errorMsg", "Já há um usuário cadastrado com esse email!")
                    res.redirect("/user/registro")
                }else{
                    //Senão, novo usuário
                    const newUser = new usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    })

                    //Criptografia de senha
                    bcrypt.genSalt(10, (error, salt) => {
                       bcrypt.hash(newUser.senha, salt, (error, hash) => {
                           //Se houver erro na criptografia
                           if(error){
                           req.flash("errorMsg", "Houve um erro durante o salvamento do usuário")
                           res.redirect("/")
                           }else{
                            //Se não houver erro na criptografia, ele salva o novo usuário
                            newUser.senha = hash 
                            newUser.save()
                                .then(() => {
                                    req.flash("successMsg", "Usuário cadastrado com sucesso!")
                                    res.redirect('/')
                                }).catch((err) => {
                                    req.flash("errorMsg", "Houve um erro interno: " + err)
                                    res.redirect('/')
                                })
                           }
                       })
                    })
                   

                }
            }).catch((err) => {
                req.flash("errorMsg", "Houve um erro interno: " + err)
                res.redirect("/")
            })
    })

    //Login do usuário
    app.get('/user/login', (req, res) => {
        res.render("users/login")
    })

    app.post('/user/login/action', (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/user/login",
            failureFlash: true
        })(req, res, next)
    })

    app.get('/user/logout', (req, res) => {
        req.logout()
        req.flash("successMsg", "Deslogado com sucesso")
        res.redirect('/')
    })

}
module.exports = userRoutes