import express from "express"
import bodyParser from "body-parser"
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import os from "os"
import connectDB from "../config/connectDB"
import cors from "cors"
import cookieParser from "cookie-parser"
require("dotenv").config()

let app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.URL_REACT,
    credentials: true
}));

//config app
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))


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