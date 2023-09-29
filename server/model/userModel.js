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
    }
}) 

const userDetail = mongoose.model('userDetail',userModel);

module.exports = userDetail;