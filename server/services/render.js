const axios = require('axios');

const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel")
const { response } = require('express');


exports.index = (req, res) => {
    console.log(req.session.userId+"..req.session.userId");
   if(req.session.userId){
    var val = {value: 0}
   }else{
    var val = {value: 1}
   }
    console.log("session");
    axios.get('http://localhost:3000/api/categories')
      .then(categoryResponse => {
        axios.get('http://localhost:3000/api/product')
          .then(productResponse => {
            res.render('index', { category: categoryResponse.data, products: productResponse.data, val });
          })
          .catch(error => {
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products');
          });
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories');
      });
    
  };
  

exports.product = (req, res) => {
    const val  = {value: 0}
    axios.get('http://localhost:3000/api/product')
        .then(productResponse => {
            axios.get('http://localhost:3000/api/categories')
                .then(categoryResponse => {
                    res.render('product', {  products: productResponse.data, category: categoryResponse.data, val });
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    res.status(500).send('Error fetching products');
                });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products');
        });
}

exports.login = async (req, res) => {
    

    const { email, password } = req.body
    // console.log(email,password +"req.body");
    try {
        // console.log(email);
        const user = await userModel.findOne({ email });
        // console.log(user.email, user.password +'user');
        if (!user) {
            res.render("login")
        } else {
            if(password === user.password && user.isVerified === true){
                req.session.userId = user._id;
                console.log(req.session.userId + "req.session.userId");

                res.redirect("/")
            }else{
                res.send("<script>window.location='/login';alert(\"Wrong Password\");</script>")
            }
            
        }
    } catch (error) {
        res.status(500).send('Error during login.');

    }

}

exports.user_login = (req, res) => {
    if(req.session.userId){
         res.redirect('/');
    }else{
        res.render("login")
    }
}


exports.signup = (req, res) => {
    if(req.session.userId){
        res.redirect('/');
    }else{
        res.render("signup")
    }
}

exports.logout_user = (req,res)=>{
    req.session.destroy();
    res.setHeader('Cache-Control', 'no-store');
    res.redirect("/")
}



exports.category = (req,res)=>{
    axios.get('http://localhost:3000/api/categories')
    .then(response=>{
        res.render("category",{ category: response.data })
        console.log("res",response.data);
    })
    .catch(err => {
        console.error(err);
        res.send(err)
    })
}




// exports.addProduct = async (req, res) => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/categories');
//       const categoryData = response.data;
//       console.log("res", categoryData);
//       res.render("addProduct", { category: categoryData });
//     } catch (err) {
//       console.error(err);
//       res.send(err);
//     }
//   }


// exports.userLogin = async (req, res) => {

//     const { email, password } = req.params;
//     console.log(req.body)
//     try {
//         console.log(email);
//         const user = await userModel.findOne({ email });
        
//         if (!user) {
//             res.render("login")
//         } else {
//             if (password === user.password) {
//                 req.session.userId = user;
//                 res.json({ success: true, message: 'Login successful' });
                
//             } else {
//                 res.json({ success: false, message: 'Invalid password' });
//             }
            
//         }
//     } catch (error) {
//         res.status(500).send('Error during login.');

//     }
// }



exports.forgot_password = async (req,res)=>{
    if(req.session.userId){
         res.redirect('/')
    }else{
        res.render("forgotpassword")
    }
}

exports.otp = async (req,res)=>{
    if(req.session.userId){
         res.redirect('/')
    }else{
        res.render("otp")
    }
}

exports.confirmPassword = async (req,res)=>{
    if(req.session.userId){
         res.redirect("/");
    }else{
        res.render("confirmPassword")
    }
}

exports.checkNumber = async (req,res)=>{
    const data = req.body.number
    try{
        let result =  await userModel.findOne({number: req.body.number})
        if(result.number === data){
            res.redirect("/otp")
        }

    }catch(error){
        console.log(error)
    }
}

exports.sendOtp = async (req,res,next)=>{
function generateRandom4DigitNumber() {
    const min = 1111;
    const max = 9999;
    // Generate a random number between min and max (inclusive)
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
  }
  
  // Usage
  const random4DigitNumber = generateRandom4DigitNumber();
  console.log(random4DigitNumber);

  req.session.otp = random4DigitNumber
  next()
}

exports.otpPost = async (req,res)=>{
    try{
        let otp = req.session.otp
        let sessionOTP = req.body.otp
        if(otp == sessionOTP){
            otp =''
            res.redirect('/confirm-password')
            }else{
                otp =''
                res.redirect('/otp')
                }
    }catch(error){
        console.log(error)
    }
}

exports.listProduct =  (req,res)=>{
    console.log("2");
    const value = req.body.value
    console.log(value);
    // axios.get("http://localhost:3000/product/list",{params:{value}})
    productModel.find({category:value})
    .then(response=>{
        console.log(response+"res....");
        res.json(response)
    })
    .catch(error=>{
        console.log(error)
    })
}

exports.productSearch = (req,res)=>{
    const val = req.body.value
    console.log(val+"........");
    productModel.find({productName: { $regex: val, $options: "i" } })
    .then(response=>{
        console.log(response+"res....");
        // res.json(response)
        if(!response){
            res.status(404).send({message:"Not found user with id"})
        }else{
            res.json(response)
        }
    })
    .catch(error=>{
        console.log(error)
    })
}

exports.priceFilter = async (req,res)=>{
    const val = req.body.value
    console.log(val+"bb");
   await productModel.find({})
    .sort({price: val})
    .then(response=>{
        console.log(response+"res....");
        // res.json(response)
        if(!response){
            res.status(404).send({message:"Not found user with id"})
        }else{
            res.json(response)
        }
    })
    .catch(error=>{
        console.log(error)
    })
}

exports.shoppingCart = async (req,res)=>{
    if(!req.session.userId){
        res.redirect("/")
    }else{
        let session = req.session.userId
        let arr = [];
        let pro = [];
        let userId = {};
        let flultotal = 0;
        userId = await userModel.findById({ _id: req.session.userId });
        const value = userId.cart.item.map((val) => val.productId);
        
        const fultot = userId.cart.item.map((val) => {
            const res = val.qty * val.price;
            return res;
        });

        flultotal = fultot.reduce((tot, val) => {
            return tot + val;
        }, 0);

        pro = await productModel.find({ _id: { $in: value } });
        // console.log(pro + "...........pro");
        // console.log(val + "...........val");
        // console.log(sess + "...........sess");
        // console.log(user + "...........user");
        // console.log(flultotal + "...........flultotal");
        const val = {value: 0}
        res.render("shoppingCart",{ products: pro, test: val, sessval: session, user: userId, total: flultotal, val})
        
    }
};
// exports.productDetails = (req,res)=>{
//     res.render("productDetails")
// }

// exports.favourite = (req,res)=>{
//     if(!req.session.userId){
//         res.redirect("/")
//     }else{
//         const val = {value: 0}
//         res.render("favourite",{val})
//     }
// }

// const cart = async (req, res) => {
//     if (req.session.isAvailable) {
//         const sess = req.session.isAvailable;

//         let val = {
//             v: 1,
//         };

//         let arr = [];

//         let pro = [];

//         let user = {};

//         let flultotal = 0;

//         user = await Userdb.findById({ _id: req.session.isAvailable });
//         const value = user.cart.item.map((val) => val.productId);

//         const fultot = user.cart.item.map((val) => {
//             const res = val.qty * val.price;
//             return res;
//         });

//         flultotal = fultot.reduce((tot, val) => {
//             return tot + val;
//         }, 0);

//         pro = await Productdb.find({ _id: { $in: value } });
//         // console.log(pro + "...........pro");
//         // console.log(val + "...........val");
//         // console.log(sess + "...........sess");
//         // console.log(user + "...........user");
//         // console.log(flultotal + "...........flultotal");

//         res.render("cart", { products: pro, test: val, sessval: sess, userdt: user, total: flultotal });
//     } else {
//         res.redirect("/login");
//     }
// };
// exports.productDetails = (req,res)=>{
//     res.render("productDetails")
// }

exports.favourite = async (req,res)=>{          
    if(!req.session.userId){
        res.redirect("/")
    }else{
        let session = req.session.userId
        let arr = [];
        let pro = [];
        let user = {};
        // let flultotal = 0;
        user = await userModel.findById({ _id: req.session.userId });
        console.log(user);
        const value = user.wishlist.item.map((val) => val.productId);
        
        // const fultot = user.wishlist.item.map((val) => {
            // const res = val.qty * val.price;
            // return res;
        // });

        // flultotal = fultot.reduce((tot, val) => {
        //     return tot + val;
        // }, 0);

        pro = await productModel.find({ _id: { $in: value } });
        // console.log(pro + "...........pro");
        // console.log(val + "...........val");
        // console.log(sess + "...........sess");
        // console.log(user + "...........user");
        // console.log(flultotal + "...........flultotal");
        const val = {value: 0}
        res.render("favourite",{ products: pro, test: val, sessval: session,  user, val})
        
    } 
}

exports.singleProduct = async (req,res)=>{
    const val = {value: 0}
    let pid=req.query.id;
    console.log(pid+"..pid")
    const user = await productModel.find({_id : pid })
    console.log(user)
    res.render("productDetails",{prod : user, val})
}

exports.checkOut = async (req, res) => {
    // if (req.session.userId) {
    //     const val = { value: 0 }
    //     let pid = req.query.id;
    //     console.log(pid + "..pid")
    //     const user = await productModel.find({ _id: pid })
    //     console.log(user)
    //     res.render("checkOut", { prod: user, val })
    // } else {
    //     res.redirect('/login')
    // }

    if(!req.session.userId){
        res.redirect("/")
    }else{
        let session = req.session.userId
        let arr = [];
        let pro = [];
        let userId = {};
        let flultotal = 0;
        userId = await userModel.findById({ _id: req.session.userId });
        const value = userId.cart.item.map((val) => val.productId);
        
        const fultot = userId.cart.item.map((val) => {
            const res = val.qty * val.price;
            return res;
        });

        flultotal = fultot.reduce((tot, val) => {
            return tot + val;
        }, 0);

        pro = await productModel.find({ _id: { $in: value } });
    
        const val = {value: 0}
        res.render("checkOut",{ products: pro, test: val, sessval: session, user: userId, total: flultotal, val})
        
    }
}

exports.addToCart = async (req,res)=>{
    console.log(req.session.userId + "req.session.userId");
if(req.session.userId){
    console.log("hai");
    let id = req.session.userId
    let productId=req.body.id;
    const price = req.body.price;
    const singletotal = req.body.price;
    console.log(price + "isAvailable");
    const qty = 1;

    const user = await userModel.findByIdAndUpdate(id);
    console.log(user);
    if(!user){
        throw new Error("user not found");
    }
    console.log(user);

        user.cart.item.push({ productId, qty, price, singletotal });
        user.cart.totalPrice += price * qty;
        await user.save();
    }else{
        res.render("login");
    }
}

exports.addToWishlist = async (req,res)=>{
    console.log(req.session.userId + "..req.session.userId");
    if(req.session.userId){
        let id = req.session.userId
        let productId = req.body.id
        let price = req.body.price
        const user = await userModel.findByIdAndUpdate(id);
        console.log(user);
        if(!user){
            throw new Error("user not found");
        }
        console.log(user);

            user.wishlist.item.push({ productId, price });
            await user.save();
        }else{
            res.render("login");
        
    }
}

exports.cartremove = async (req, res) => {
    
    const idvalue = req.body.idvalues;
    const sessvalue = req.body.sessvalues;
    console.log(sessvalue);
    console.log(idvalue);

    const user = await userModel.findByIdAndUpdate({ _id: sessvalue });

    const index = user.cart.item.indexOf(
        user.cart.item.find((val, ind) => {
            return val.productId == idvalue;
        })
    );

    console.log(index);

    user.cart.item.splice(index, 1);

    await user.save();

    userModel.findByIdAndUpdate({ _id: sessvalue })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                console.log(data);
                res.json(data)
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
       
 }

 exports.removeWishlist = async (req, res) => {
    
    const idvalue = req.body.idvalues;
    const sessvalue = req.body.sessvalues;
    console.log(sessvalue);
    console.log(idvalue);

    const user = await userModel.findByIdAndUpdate({ _id: sessvalue });

    const index = user.wishlist.item.indexOf(
        user.wishlist.item.find((val, ind) => {
            return val.productId == idvalue;
        })
    );

    console.log(index);

    user.wishlist.item.splice(index, 1);

    await user.save();

    userModel.findByIdAndUpdate({ _id: sessvalue })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                console.log(data);
                res.json(data)
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
       
 }

 exports.countTotal = async (req,res)=>{
        const idvalue = req.body.idvalues;
        const sessvalue = req.body.sessvalues;
        const changenum = req.body.change;
        console.log(changenum + "changenum");
    
        const user = await userModel.findByIdAndUpdate({ _id: sessvalue });
    
        const index = user.cart.item.indexOf(
            user.cart.item.find((val) => {
                return val.productId == idvalue;
            })
        );
    
        console.log(index);
        if (changenum == 1) {
            const quantity = user.cart.item[index].qty;
    
            console.log(index + "in");
    
            user.cart.item[index].qty++;
            await user.save()
            let valp = user.cart.item[index].price
            let valq = user.cart.item[index].qty
            user.cart.item[index].singletotal = valp*valq
            await user.save()
    
        } else {
            const quantity = user.cart.item[index].qty;
    
            user.cart.item[index].qty--;
    
            await user.save()
    
            let valp = user.cart.item[index].price
            let valq = user.cart.item[index].qty
            user.cart.item[index].singletotal = valp*valq
            await user.save()
        }
    
        await userModel.findById({ _id: sessvalue })
    
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    console.log("4");
                    console.log(data);
                    res.json(100);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
};




// Admin
// --------------------------------------------------------------



exports.dashboard = (req, res) => {
    if(req.session.userId){
        res.render("dashboard")
    }else{
        res.redirect("/adminLogin")
    }
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.redirect("/adminLogin")
        } else {
            if (password === user.password && user.isVerified === true && (parseInt(user.role) === 1)) {
                req.session.userId = user;
                res.redirect("/adminLogin/dashboard")
            } else {
                res.send("<script>window.location='/adminLogin';alert(\"Wrong Password\");</script>")
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Error during admin login.');
    }
}

exports.admin_Login = (req, res) => {
    if(req.session.userId){
        res.redirect("/adminLogin/dashboard")
    }else{
        res.render("adminLogin")
    }   
}

exports.logout_admin = (req,res)=>{
    req.session.destroy();
    res.setHeader('Cache-Control', 'no-store');
    res.redirect("/adminLogin")
}


exports.addCategory = (req, res) => {
    if(req.session.userId){
        res.render("addCategory")
    }else{
        res.redirect("/adminLogin")
    }   
}


// exports.product_table = (req, res) => {
//     if (req.session.userId){
//         axios.get('http://localhost:3000/api/product')
//         .then(response=>{
//             res.render("product-table",{ products: response.data })
//             console.log("res", response.data);
//         })
//         .catch(err=>{
//             console.error(err);
//             res.send(err)
//         })
//     }else{
//         res.redirect("/adminLogin")
//     }
    
    
// }

exports.addProduct = (req, res) => {
    if (req.session.userId) {
        axios.get('http://localhost:3000/api/categories')
            .then(response => {
                res.render("addProduct", { category: response.data })
                console.log("res", response.data);
            })
            .catch(err => {
                console.error(err);
                res.send(err)
            })
    } else {
        res.redirect("/adminLogin")
    }
}

exports.block_user = async (req, res)=>{
    try{
        const id = req.query.id
        const userData = await userModel.findById({_id: id});
    if(userData.isVerified === true){
    await userModel.findByIdAndUpdate(
        {_id: id},
        { $set: { isVerified: false}}
    )
    }else{
        await userModel.findByIdAndUpdate(
            { _id: id },
            {$set:{isVerified :true }}
            );
    }
    res.redirect("/adminLogin/user-table");
    }catch (error){
        console.log(error);
    }
}

exports.user_table = (req, res) => {
    if (req.session.userId) {
        axios.get('http://localhost:3000/api/user')
            .then(response => {
                res.render("tables", { users: response.data })
            })
            .catch(err => {
                res.send(err)
            })
    } else {
        res.redirect("/adminLogin")
    }
}

exports.update_user = (req, res) => {
    if(req.session.userId){
        axios.get('http://localhost:3000/api/user', { params: { id: req.query.id } })
        .then(function (userData) {
            res.render("update_user", { user: userData.data })
            console.log(userData.data);
        })
        .catch(err => {
            console.error(err);
            res.send(err)
        })
    }else{
        res.redirect("/adminLogin")
    }
}

// exports.editProduct = (req,res)=>{
//     if (req.session.userId) {
//         axios.get('http://localhost:3000/api/product')
//             .then(response => {
//                 res.render("editProduct", { users: response.data })
//             })
//             .catch(err => {
//                 res.send(err)
//             })
            
//     } else {
//         res.redirect("/adminLogin")
//     }
    
// }

exports.product_table = async (req, res) => {
    if (req.session.userId) {
        try {
            const products = await productModel.find({}).exec();
            res.render("product_table", { products });
        } catch (err) {
            res.send(err);
        }
    } else {
        res.redirect("/adminLogin");
    }
}

exports.block_product = async (req, res)=>{
    try{
        const id = req.query.id
        const productData = await productModel.findById({_id: id});
    if(productData.isVerified === true){
    await productModel.findByIdAndUpdate(
        {_id: id},
        { $set: { isVerified: false}}
    )
    }else{
        await productModel.findByIdAndUpdate(
            { _id: id },
            {$set:{isVerified :true }}
            );
    }
    res.redirect("/adminLogin/product-table");
    }catch (error){
        console.log(error);
    }
}

exports.editProduct = async (req,res)=>{
    if (req.session.userId) {
        try {
            console.log(req.query.id);
            const product = await productModel.findById({_id: req.query.id}).exec();
            console.log(product);
            res.render("editProduct", { product });
        } catch (err) {
            res.send(err);
        }
    } else {
        res.redirect("/adminLogin");
    }
      
}

exports.editCategory = async (req,res)=>{
    if (req.session.userId) {
        try {
            console.log(req.query.id);
            const category = await categoryModel.findById({_id: req.query.id}).exec();
            console.log(category);
            res.render("editCategory", { category });
        } catch (err) {
            res.send(err);
        }
    } else {
        res.redirect("/adminLogin");
    }
}

exports.block_category = async (req,res)=>{
    try{
        const id = req.query.id
        const categoryData = await categoryModel.findById({_id: id});
    if(categoryData.isVerified === true){
    await categoryModel.findByIdAndUpdate(
        {_id: id},
        { $set: { isVerified: false}}
    )
    }else{
        await categoryModel.findByIdAndUpdate(
            { _id: id },
            {$set:{isVerified :true }}
            );
    }
    res.redirect("/adminLogin/category");
    }catch (error){
        console.log(error);
    }
}

// exports.update_product = async (req, res) => {
//     if(req.session.userId){
//         try{
//             const category = await categoryModel.find({}).exec();
//             res.render("editProduct")
//         }catch(err) {
//             console.error(err);
//             res.send(err)
//         }
//     }else{
//         res.redirect("/adminLogin")
//     }
// }

