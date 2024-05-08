const express = require("express")
let permissions = require("../data/permissions")
const routerPermissions = express.Router()
let users = require("../data/users")
let authorizers = require("../data/authorizers")
let jwt = require("jsonwebtoken")

routerPermissions.get("/", (req,res)=>{
    let apiKey = req.query.apiKey
    let infoApiKey = null
    
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }

    let text = req.query.text
    if(text!=undefined){
        let permissionsText=permissions.filter(p=>p.text.includes(text))
        return res.json(permissionsText)
    }
    res.json(permissions)
})

routerPermissions.get("/:id", (req,res)=>{
    let apiKey = req.query.apiKey
    let infoApiKey = null
    
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }

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
    let apiKey = req.query.apiKey
    let infoApiKey = null
    
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }
    let user = users.find(u=>u.id=infoApiKey.id)

    if(user.role!="admin")
        return res.status(401).json({error: "user not admin"})

    let permissionId = req.params.id


    if (permissionId==undefined){
        return res.status(400).json({error: "no permissionId"})
    }

    let permission = permissions.find(p=>p.id=permissionId && p.userId==infoApiKey.id)
    permission.approvedBy.push(authorizer.id)

    res.json(permission)
})

routerPermissions.put("/:id",(req,res)=>{
    let apiKey = req.query.apiKey
    let infoApiKey = null
    
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }

    let permissionId = req.params.id
    let text = req.body.text

    if(permissionId==undefined)
        return res.status(400).json({error: "no id"})

    let permission=permissions.find(p=>p.id==permissionId && p.userId==infoApiKey.id)
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
    let apiKey = req.query.apiKey
    let infoApiKey = null

    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }
     

    if (text == undefined){
        return res.status(400).json({error:"no text in the body"})
    }

    let lastId = permissions[permissions.length-1].id

    permissions.push({
        id:lastId+1,
        text:text,
        approbedBy:[],
        userId:infoApiKey.id
    })

    res.json({id: lastId+1})
})

routerPermissions.delete("/:id",(req,res)=>{
    let apiKey = req.query.apiKey
    let infoApiKey = null
    
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }
    catch(error){
        return res.status(401).json({error:"invalid token"})
    }
    
    let permissionId = req.params.id

    if(permissionId==undefined)
        return res.status(400).json({error: "no id"})

    let permission=permissions.find(p=>p.id==permissionId)

    if(permission==undefined)
        return res.status(400).json({error: "no permission with this id"})

    permissions=permissions.filter(p=>p.id!=permissionId)

    res.json({deleted: true})
})

module.exports = routerPermissions