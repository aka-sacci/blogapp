const mongoose = require('mongoose')


//CONFIG MONGOOSE
mongoose.connect("mongodb://localhost/blogapp")
    .then(() => {
        console.log("Conectado ao Mongo!")
    })
    .catch((err) => {
        console.log("Erro ao se conectar ao Mongo: " + err)
    })

    module.exports = mongoose;