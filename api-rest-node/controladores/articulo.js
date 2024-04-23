
const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una accion de prueba en mi controlador de Articulos"
    });

}

const curso = ((req, res) => {

    console.log("se ha ejecutado el endpoint probando");

    return res.status(200).json({
        curso: "master en react",
        autor: "Victor Robles",
        anio: "2024"
    });

});

const home = ((req, res) => {

    return res.status(200).send(
        `<h1> Home </h1>`
    );

});

const crear = (req, res) => {

    // Recoger los parametros por POST a guardar
    let parametros = req.body;

    // Validar los datos
    try {
        validarArticulo(parametros);

    } catch (error) {

        return res.status(500).json({
            status: "error",
            mensaje: "Error al crear"
        });
    }

    // Crear objeto a guardar
    const articulo = new Articulo(parametros);


    /*MANUAL
    articulo.titulo = parametros.titulo;
     */

    // Asignarle valores a objeto basado en el modelo (manual o automatico)

    // Guardar el articulo en la Base de Datos
    articulo.save()
        .then(articuloGuardado => {
            // Devolver resultado
            return res.status(200).json({
                status: "success",
                articulo: articuloGuardado,
                mensaje: "Articulo guardado ok"
            });
        })
        .catch(err => {
            if (error || !articuloGuardado) {

                return res.status(400).json({
                    status: "error",
                    mensaje: "No se han guardado el articulo"
                });

            }
        });

};


const listar = (req, res) => {

    let consulta = Articulo.find({});

    if (req.params.ultimos) {
        consulta.limit(3);
    }

    consulta.sort({ fecha: 1 })
        .then(articulos => {
            return res.status(200).json({
                status: "success",
                parametro: req.params.ultimos,
                contador: articulos.length,
                articulos
            });
        })
        .catch(err => {
            if (err || !articulos) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos"
                });
            }
        });

}


const uno = (req, res) => {
    // Recoger id por la url
    let id = req.params.id;

    Articulo.findById(id)
        .then(articulo => {
            if (articulo) {
                return res.status(200).json({
                    status: "success",
                    mensaje: "articulo encontrado ok",
                    articulo
                });
            }
        })
        .catch(error => {
            return res.status(200).json({
                status: "error",
                mensaje: "No se pudo localizar el articulo"
            });
        });

    // Buscar el articulo 
    /* Articulo.findById(id, (error, articulo) => {
     
     if(articulo){
         console.log(articulo);
     }
     
     console.log(error);
     // Si no existe devolver error
 
     // Si existe devolver resultado
 
     });
 */
}


const borrar = (req, res) => {

    let id_articulo = req.params.id;


    Articulo.findByIdAndDelete(id_articulo)
        .then(articulo => {

            return res.status(200).json({
                status: "success",
                mensaje: "Articulo eliminado OK",
                articulo
            });

        })
        .catch(error => {
            return res.status(400).json({
                status: "error",
                mensaje: "No se encntro el articulo a borrar"
            });
        })

}



const editar = (req, res) => {
    // Recoger el id articulo a editar
    let articuloId = req.params.id;

    // Recoger datos del body
    let parametros = req.body;

    try {
        validarArticulo(parametros);

    } catch (error) {

        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar"
        });
    }

    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true })
        .then(articuloActualizado => {
            if (articuloActualizado) {
                console.log('Documento actualizado:', articuloActualizado);
                // Devolver respuesta
                return res.status(200).json({
                    status: "success",
                    articulo: articuloActualizado
                });
            } else {
                console.log('Documento no encontrado o error en la actualización');
            }
        })


}


const subir = (req, res) => {

    // Configurar Multer

    // Recoger el fichero de imagen subido
   if(!req.file && !req.files){
    return res.status(400).json({
        status: 'error',
        mensaje: 'Peticion invalida'
    });
   }

    // Conseguir nombre de la imagen
    let archivo = req.file.originalname;

    // Conseguir la extension de la imagen
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    // Comprobar Extension correcta
    if (extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif") {

        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'Imagen invalida'
            });
        })
    } else {

          // Recoger el id articulo a editar
    let articuloId = req.params.id;


    Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename}, { new: true })
        .then(articuloActualizado => {
            if (articuloActualizado) {
                console.log('Documento actualizado:', articuloActualizado);
                // Devolver respuesta
                return res.status(200).json({
                    status: "success",
                    articulo: articuloActualizado,
                    fichero: req.file
                });
            } else {
                console.log('Documento no encontrado o error en la actualización');
            }
        })
  
    }
    // Actualizar articulo


}

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    // Recupero imagen para mostrar si es que existe
    fs.stat(ruta_fisica, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: 'error',
                mensaje: 'La imagen no existe'
            });
        }
    })

}

const buscador = (req,res) => {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR
    Articulo.find({
        "$or": [
            {"titulo": {"$regex": busqueda, "$options": "i" }},
            {"contenido": {"$regex": busqueda, "$options": "i" }}
        ]
    })
    .sort({fecha: -1})
    .then(articulos => {
        return res.status(200).json({
            status: "success",
            articulos
        });
    })
    .catch(error => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos"
        });
    });

    // Orden

    // Ejecutar consulta

    // Devolver resultado
}

module.exports = {
    prueba,
    curso,
    home,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}