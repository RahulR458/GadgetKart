const express = require("express");
const route = express.Router()

const services = require("../services/render");
const userController = require('../controller/userController');
const categoryController = require('../controller/categoryController');
const productController = require('../controller/productController');

route.get("/",services.index);
route.get("/products",services.product)
route.get("/login",services.user_login)
route.get("/signup",services.signup)
route.get('/logout', services.logout_user);
route.get('/forgot-password', services.forgot_password);
route.get('/otp',services.sendOtp, services.otp);
route.get('/confirm-password',services.confirmPassword)
route.get('/shoppingCart',services.shoppingCart)
// route.get('/productDetails',services.productDetails)
route.get('/favourite',services.favourite)
route.get('/singleProduct',services.singleProduct)
route.get('/checkOut',services.checkOut)

route.post('/checkNumber',services.checkNumber)
route.post('/otpPost', services.otpPost);
route.post('/product/list', services.listProduct);
route.post('/product/search', services.productSearch);
route.post('/product/priceFilter', services.priceFilter);

route.put('/addToCart',services.addToCart)
route.put('/addToWishlist',services.addToWishlist)
route.put('/cart/remove',services.cartremove)
route.put('/wishlist/remove',services.removeWishlist)
route.put('/cart/countTotal',services.countTotal)

function a(req,res,next){
    console.log("middleware")
    next()
}

route.post("/login",a,services.login)
// route.get("/userLogin/:email/:password",services.userLogin)

// route.get("/update-user",services.update_user)
// route.get("/user-table",services.user_table)
// route.get("/dashboard",services.dashboard)
// route.get("/adminLogin",services.admin_Login)

route.post('/api/categories',categoryController.create);
route.get('/api/categories',categoryController.list);
route.put('/api/categories/:id',categoryController.update);
// route.delete('/api/categories/:id',categoryController.delete);

route.post('/api/product',productController.create);
route.get('/api/product',productController.list);
route.put('/api/product/:id',productController.update);
// route.delete('/api/product/:id',productController.delete);

//API
route.post('/api/user',userController.create);
route.get('/api/user',userController.find);
route.put('/api/user/:id',userController.update);
route.delete('/api/user/:id',userController.delete);

module.exports = route