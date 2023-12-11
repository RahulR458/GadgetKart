const express = require("express");
const route = express.Router()

const services = require("../services/render");
// const categoryController = require('../controller/categoryController');

route.get("/",services.admin_Login)
route.post("/",services.adminLogin)
route.get("/update-user",services.update_user)
route.get("/user-table",services.user_table)
route.get("/dashboard",services.dashboard)
route.get('/logout', services.logout_admin);
route.get('/category', services.category);
route.get('/addCategory', services.addCategory);
route.get('/addProduct', services.addProduct);
route.get('/block-user',services.block_user)
route.get('/product-table',services.product_table)
route.get('/block_product',services.block_product)
route.get('/editProduct', services.editProduct);
route.get('/editCategory',services.editCategory)
route.get('/block_category',services.block_category)
route.get('/orderDetails',services.orderDetails)
route.get('/addCoupon',services.addCoupon)
route.get('/addOffer',services.addOffer)
route.get('/coupon',services.couponTable)
route.get('/offer',services.offerTable)
route.get('/editCoupon',services.editCoupon)
route.get('/editOffer',services.editOffer)
route.get('/adminErrorPage',services.adminErrorPage)

// route.get('/update-product', services.update_product);

function abc(req,res,next){
    console.log(1234567890)
    next()
}
route.put('/status/change',abc,services.statusChange)


// route.post('/api/categories',categoryController.create);
// route.get('/api/categories',categoryController.list);
// route.patch('/api/categories/:id',categoryController.update);
// route.delete('/api/categories/:id',categoryController.delete);


module.exports = route