const express = require("express")
const users = require("../data/users")
const routerUsers = express.Router()

routerUsers.get("/", (req,res)=>{
    res.json(users.map((u)=>{return {id:u.id, email:u.email}}))
})

routerUsers.get("/:id", (req,res)=>{
    let id = req.params.id
    if(id == undefined){
        return res.status(400).json({error: "no id"})
    }
    let user = users.find(u=>u.id==id)
    if(user==undefined){
        return res.status(400).json({error: "invalid id"})
    }
    res.json({id: user.id, email:user.email})
})

routerUsers.post("/",(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let errores = []

    if(email==undefined)
        errores.push("no email")
    if(users.find(u=>u.email==email)!=undefined)
        errores.push("user already exists")
    if(password==undefined)
        errores.push("no password")
    if(password!=undefined && password.length<4)
        errores.push("password less than 4")

    if(errores.length>0){
        return res.status(400).json({errores:errores})
    }

    users.push({
        id: users.length+1,
        email:email,
        password:password
    })

    res.json({lastId: users.length})
})


module.exports = routerUsers