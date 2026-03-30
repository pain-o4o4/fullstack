import express from "express"
import bodyParser from "body-parser"
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import os from "os"
import connectDB from "../config/connectDB"
import cors from "cors"
require("dotenv").config()

let app = express();
app.use(cors({
    origin: process.env.URL_REACT, // Ví dụ: http://localhost:3000
    credentials: true
}));

//config app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

configViewEngine(app)
initWebRoutes(app)
connectDB()

let port = process.env.PORT || 2004
// app.listen(port, () => {
//     console.log("Server running at http://localhost:" + port)
// })

app.listen(port, "0.0.0.0", () => {
    const interfaces = os.networkInterfaces()

    const network = Object.values(interfaces)
        .flat()
        .find(i => i.family === "IPv4" && !i.internal).address

    console.log(`
Server running:
Local:   http://localhost:${port}
Network: http://${network}:${port}
`)
})