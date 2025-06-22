import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import authRouter from "./routes/auth.routes.js"
import welcomeRouter from "./routes/welcome.route.js"

//give path to routes app.use('/api/home',homerouter)
app.use("/api/auth",authRouter)
app.use("/api/welcome",welcomeRouter)

export {app};