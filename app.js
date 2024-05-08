let express = require("express")
const jwt = require("jsonwebtoken")

let app = express()
let port = 8081

//leer datos del body en formato json
app.use(express.json())

app.use(express.static("public"))

//middleware
app.use(["/permissions"],(req,res,next)=>{
    console.log("middleware execution")

    let apiKey = req.query.apiKey
    if(apiKey==undefined)
        return res.status(401).json({error: "no apikey"})

    let infoApiKey = null
    
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }

    req.infoApiKey=infoApiKey
    next()
})

let routerPermissions= require("./routers/routerPermissions")
let routerUsers=require("./routers/routerUsers")
let routerLogin=require("./routers/routerLogin")
const { info } = require("pdfkit")
app.use("/permissions", routerPermissions)
app.use("/users", routerUsers)
app.use("/login",routerLogin)

app.listen(port, ()=>{
    console.log("Servidor activo en "+port)
})