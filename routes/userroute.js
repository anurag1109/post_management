const express = require("express")
const userrouter = express.Router()
userrouter.use(express.json())

const { register, login } = require("../controller/authcontroller")

userrouter.post("/register",register)
userrouter.post("/login", login)

module.exports={userrouter}