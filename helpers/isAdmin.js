//Verifica se: O user está autenticado e se ele é admin

const isAdmin = (req, res, next) => {

    if(req.isAuthenticated() && req.user.admin == 1){
        return next();
    }

    req.flash("errorMsg", "Você precisa ser um admin para acessar essa rota!")
    res.redirect("/")
}

module.exports = isAdmin