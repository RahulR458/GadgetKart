const express = require("express");
const route = express.Router()

const services = require("../services/render");
const userController = require('../controller/userController');

route.get("/",services.index);
route.get("/products",services.product)
route.get("/login",services.login)
route.get("/register",services.register)
route.get("/user-table",services.user_table)
route.get("/dashboard",services.dashboard)
route.get("/adminLogin",services.admin_Login)

//API
route.post('/api/user',userController.create);
route.get('/api/user',userController.find);
route.put('/api/user/:id',userController.update);
route.delete('/api/user/:id',userController.delete);

module.exports = route