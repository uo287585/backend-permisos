const express = require("express")
const permissions = require("../data/permissions")
const routerPermissions = express.Router()
let users = require("../data/users")
let authorizers = require("../data/authorizers")

routerPermissions.get("/", (req,res)=>{
    let text = req.query.text
    if(text!=undefined){
        let permissionsText=permissions.filter(p=>p.text.includes(text))
        return res.json(permissionsText)
    }
    res.json(permissions)
})

routerPermissions.get("/:id", (req,res)=>{
    let id = req.params.id
    if(id == undefined){
        return res.status(400).json({error: "no id"})
    }
    let permission = permissions.find(u=>u.id==id)
    if(permission==undefined){
        return res.status(400).json({error: "invalid id"})
    }
    res.json(permission)
})

routerPermissions.put("/:id/approvedBy",(req,res)=>{
    let permissionId = req.params.id
    let authorizerEmail = req.body.authorizerEmail
    let authorizerPassword = req.body.authorizerPassword

    //validation
    let authorizer = authorizers.find(a=>a.email==authorizerEmail && a.password==authorizerPassword)

    if(authorizer==undefined){
        return res.status(401).json({error: "no autorizado"})
    }

    if (permissionId==undefined){
        return res.status(400).json({error: "no permissionId"})
    }

    let permission = permissions.find(p=>p.id=permissionId)
    permission.approvedBy.push(authorizer.id)

    res.json(permission)
})

routerPermissions.put("/:id",(req,res)=>{
    let permissionId = req.params.id
    let text = req.body.text

    if(permissionId==undefined)
        return res.status(400).json({error: "no id"})

    let permission=permissions.find(p=>p.id==permissionId)
    if(permission==undefined)
        return res.status(400).json({error: "no permission with this id"})

    //quieres modificar el texto del permiso
    if(text!=undefined){
        permission.text=text
    }

    res.json({modified: true})
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