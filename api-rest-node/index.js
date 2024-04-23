const { conexion } = require("./basedatos/conexion");
const  express = require("express");
const cors = require("cors");

// inicializar app
console.log("App node arrancada");

// conectar a la base de datos
conexion();

// Servidor Node para poder escuchar peticiones http y crear rutas
const app = express();
const puerto = 3900;
// Configurar CORS
app.use(cors());

// Convertir body a objeto JS
app.use(express.json()); // Para recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); // form-urlencoded

//Rutas 
const rutas_articulo = require("./rutas/articulos");

// Cargo las rutas
app.use("/api", rutas_articulo);


// Rutas prueba hardcodeadas
app.get("/", (req,res) => {

    return res.status(200).send(
        `<h1> Home </h1>`
    );

});


// Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto " + puerto);
});