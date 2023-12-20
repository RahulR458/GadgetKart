const express = require("express");
const route = express.Router()

const services = require("../services/render");
// const categoryController = require('../controller/categoryController');

const middleware = require("../middleware/adminAuth")

route.get("/",middleware.isLogout,services.admin_Login)
route.post("/",services.adminLogin)
route.get("/update-user",middleware.isLogin,services.update_user)
route.get("/user-table",middleware.isLogin,services.user_table)
route.get("/dashboard",middleware.isLogin,services.dashboard)
route.get('/logout', services.logout_admin);
route.get('/category', services.category);
route.get('/addCategory',middleware.isLogin, services.addCategory);
route.get('/addProduct',middleware.isLogin, services.addProduct);
route.get('/block-user',services.block_user)
route.get('/product-table',middleware.isLogin,services.product_table)
route.get('/block_product',services.block_product)
route.get('/editProduct',middleware.isLogin, services.editProduct);
route.get('/editCategory',middleware.isLogin,services.editCategory)
route.get('/block_category',services.block_category)
route.get('/orderDetails',services.orderDetails)
route.get('/addCoupon',services.addCoupon)
route.get('/addOffer',middleware.isLogin,services.addOffer)
route.get('/coupon',middleware.isLogin,services.couponTable)
route.get('/offer',middleware.isLogin,services.offerTable)
route.get('/editCoupon',middleware.isLogin,services.editCoupon)
route.get('/editOffer',middleware.isLogin,services.editOffer)
route.get('/adminErrorPage',services.adminErrorPage)

// route.get('/update-product', services.update_product);

function abc(req,res,next){
    console.log(1234567890)
    next()
}
route.put('/status/change',abc,services.statusChange)


route.post('/admin/pdf/downloard',abc,services.salesReport)
route.post('/admin/pdf/download',services.customPDF)
route.post('/admin/graph/data',services.graphData)

// route.post('/api/categories',categoryController.create);
// route.get('/api/categories',categoryController.list);
// route.patch('/api/categories/:id',categoryController.update);
// route.delete('/api/categories/:id',categoryController.delete);


module.exports = route