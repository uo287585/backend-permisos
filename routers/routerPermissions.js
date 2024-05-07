const express = require("express")
const permissions = require("../data/permissions")
const routerPermissions = express.Router()
let users = require("../data/users")

routerPermissions.get("/", (req,res)=>{
    res.json(permissions)
})

routerPermissions.post("/",(req,res)=>{
    let text = req.body.text
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword

    let listUsers = users.filter(u=>u.email==userEmail && u.password==userPassword)

    if(listUsers.length==0){
        return res.status(401).json({error: "no autorizado"})
    }

    let errors = []

    if (text == undefined){
        errors.push("no text in the body")
    }
    if (userId==undefined){
        errors.push("no user Id")
    }

    if(errors.length>0){
        return res.status(400).json({errors:errors})
    }

    let lastId = permissions[permissions.length-1].id

    permissions.push({
        id:lastId+1,
        text:text,
        approbedBy:[],
        userId:listUsers[0].id
    })

    res.json({id: lastId+1})
})

module.exports = routerPermissions