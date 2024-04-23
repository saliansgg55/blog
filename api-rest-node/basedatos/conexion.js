const mongoose = require('mongoose');

const conexion = async() => {

    try {

        await  mongoose.connect("mongodb://localhost:27017/mi_blog");        
        console.log("conectado correctamente a la BD mi_blog");

    } catch(error) {

        console.log(error)
        throw new Error("No se ha podido conectar a la Base de datos");

    }
}

module.exports = {
    conexion
}