const axios = require('axios');
// const { response } = require('express');


exports.index = (req,res)=>{
    res.render("index")
}

exports.product = (req,res)=>{
    res.render("product")
}

exports.login = (req,res)=>{
    res.render("login")
}
exports.register = (req,res)=>{
    res.render("register")
}

exports.user_table = (req,res)=>{
    axios.get('http://localhost:3000/api/user')
    .then(response=>{
        res.render("tables",{users:response.data})
    })
    .catch(err=>{
        res.send(err)
    })
    // res.render("tables",{user:"new user"})
}

exports.dashboard = (req,res)=>{
    res.render("dashboard")
}

exports.admin_Login = (req,res)=>{
    res.render("adminLogin")
}