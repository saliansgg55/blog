
const express = require("express");
const multer = require("multer");
const router = express.Router();
const ArticuloController = require("../controladores/articulo");


// Storage (donde se van a guardar mis imagenes)
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb)  {
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const subidas = multer({storage:almacenamiento});



// Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);
router.get("/", ArticuloController.home);

// Ruta util
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.uno);
router.delete("/borrar/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);
router.post("/subir-imagen/:id",[ subidas.single("file") ],ArticuloController.subir);
router.get("/imagen/:fichero", ArticuloController.imagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;