const { Schema, model } = require("mongoose");

// Estructura del modelo
const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "defaul.png"
    }
});

module.exports = model("Articulo", ArticuloSchema, "articulos");