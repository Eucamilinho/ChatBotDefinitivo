// Código refactorizado:
import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"// dotenv importado y configuración agregada para leer variables de entorno
const port = process.env.PORT || 3000// set port to environment variable or 3000 if not found 
const app = express()// instancia expresa creada
app.use(cors())// habilitar cors para todas las solicitudes
app.use(express.json())// habilitó el analizador de cuerpo json para todas las solicitudes
app.use(`/`,routes)// configurar rutas para la aplicación

app.listen(port, () => console.log(`Ready...${port}`))// start the server on the specified port