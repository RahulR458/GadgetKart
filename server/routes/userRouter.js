const express = require("express");
const route = express.Router()

const services = require("../services/render");
const userController = require('../controller/userController');
const categoryController = require('../controller/categoryController');
const productController = require('../controller/productController');
const couponController = require("../controller/couponController")
const offerController = require("../controller/offerController")

route.get("/",services.index);
route.get("/products",services.product)
route.get("/login",services.user_login)
route.get("/signup",services.signup)
route.get('/logout', services.logout_user);
route.get('/forgot-password', services.forgot_password);
route.get('/otp',services.sendOtp, services.otp);
route.get('/confirm-password',services.confirmPassword)
route.get('/shoppingCart',services.shoppingCart)
route.get('/favourite',services.favourite)
route.get('/singleProduct',services.singleProduct)
route.get('/checkOut',services.checkOut)
route.get('/myAccount',services.myAccount)
route.get('/orderSucces',services.orderSucces)
route.get('/404_errorPage',services.errorPage)
route.get('/orderStatus',services.orderStatus)


route.post("/login",services.login)
route.post('/checkNumber',services.checkNumber)
route.post('/otpPost', services.otpPost);
route.post('/product/list', services.listProduct);
route.post('/product/search', services.productSearch);
route.post('/product/priceFilter', services.priceFilter);
function abc(req,res,next){
    console.log("middleware");
    next()
}
route.post('/myAcountAddress',services.myAcount)
route.post('/checkoutPost',services.checkoutPost)
route.post('/poduct/pagination',services.pagination)
route.post('/newPasswordPost',services.newPasswordPost)
route.put('/couponPost',abc,services.couponPost)

route.put('/addToCart',services.addToCart)
route.put('/addToWishlist',services.addToWishlist)
route.put('/cart/remove',services.cartremove)
route.put('/wishlist/remove',services.removeWishlist)
route.put('/cart/countTotal',services.countTotal)
route.put('/return/reason',services.returnReason)

route.post('/api/categories',categoryController.create);
route.get('/api/categories',categoryController.list);
route.put('/api/categories/:id',categoryController.update);

route.post('/api/product',productController.create);
route.get('/api/product',productController.list);
route.put('/api/product/:id',productController.update);

route.post('/api/coupon',couponController.create);



route.post('/api/offer',offerController.create);


route.post('/api/user',userController.create);
route.get('/api/user',userController.find);
route.put('/api/user/:id',userController.update);
route.delete('/api/user/:id',userController.delete);


// route.post('/api/dash',services.dash);

module.exports = route