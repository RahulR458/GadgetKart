const mongoose = require("mongoose")

var productModel = new mongoose.Schema({
    productName:{
        type:String,
        require:true    
    }, 
    description:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryModel'
    },
    stock:{
        type:Number,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    isVerified: Boolean
}) 

const productDetails = mongoose.model('productDetails',productModel);

module.exports = productDetails;