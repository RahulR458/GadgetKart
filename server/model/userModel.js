const mongoose = require("mongoose")

var userModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    number:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:0
    },
    isVerified: Boolean,
    isAdmin:Boolean,
    cart:{
        item:[
            {
                productId:{
                    type:mongoose.Types.ObjectId,
                    ref:'productDetails',
                    required:true
                },
                qty:{
                    type:Number,
                    required:true    
                },   
                price:{
                    type:Number

                },
                singletotal:{
                    type:Number

                }
            }
        ],
        totalPrice :{
            type:Number,
            default:0
        }
    },
    wishlist: {
        item: [{
          productId: {
            type: mongoose.Types.ObjectId,
            ref: 'productDetails',
            required: true
          },
          price: {
            type: Number
          }
        }]
      }
}) 

const userDetail = mongoose.model('userDetail',userModel);

module.exports = userDetail;


