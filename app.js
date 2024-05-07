let express = require("express")

let app = express()
let port = 8081

//leer datos del body en formato json
app.use(express.json())

let routerPermissions= require("./routers/routerPermissions")
let routerUsers=require("./routers/routerUsers")
app.use("/permissions", routerPermissions)
app.use("/users", routerUsers)

app.listen(port, ()=>{
    console.log("Servidor activo en "+port)
})