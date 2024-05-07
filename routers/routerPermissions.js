const express = require("express")
const permissions = require("../data/permissions")
const routerPermissions = express.Router()

routerPermissions.get("/", (req,res)=>{
    res.json(permissions)
})

module.exports = routerPermissions