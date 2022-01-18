const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//Carregamento do model de usuário
const Usuarios = require("../models/Usuario")
const usuario = Usuarios.model("usuarios")

const auth = (passport) => {
passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
    
    usuario.findOne({email: email})
        .then((user) => {
            !user ? done(null, false, {message: "Essa conta não existe!"}) :

            bcrypt.compare(senha, user.senha, (err, senhasIguais) => {
                senhasIguais ? done(null, user) :
                done(null, false, {message: "Senha incorreta!"})
            })
   
        }).catch((err) => {

        })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})


passport.deserializeUser((id, done) => {
    usuario.findById(id, (err, user) => {
        done(err, user)
    })

})

}

module.exports = auth
