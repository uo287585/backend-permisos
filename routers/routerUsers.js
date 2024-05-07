const express = require("express")
const users = require("../data/users")
const routerUsers = express.Router()

routerUsers.get("/", (req,res)=>{
    res.json(users.map((u)=>{return {id:u.id, email:u.email}}))
})

module.exports = routerUsers