const axios = require('axios');
const bcrypt = require('bcrypt');

const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel")
const addressModel = require("../model/addressModel")
const orderModel = require("../model/orderModel")
const couponModel = require("../model/couponModel")
const offerModel = require("../model/offerModel")
const dashboardModel = require("../model/dashboardModel")


const { response } = require('express');
const { render } = require('ejs');


// exports.index = (req, res) => {
//     try{
//         console.log(req.session.userId+"..req.session.userId");
//         if(req.session.userId){
//          var val = {value: 0}
//         }else{
//          var val = {value: 1}
//         }
//          console.log("session");
//          axios.get('http://localhost:3000/api/categories')
//            .then(categoryResponse => {
//              axios.get('http://localhost:3000/api/product')
//                .then(productResponse => {
//                  res.render('index', { category: categoryResponse.data, prod: productResponse.data, val });
//                })
//                .catch(error => {
//                  console.error('Error fetching products:', error);
//                  res.status(500).send('Error fetching products');
//                });
//            })
//            .catch(error => {
//              console.error('Error fetching categories:', error);
//              res.status(500).send('Error fetching categories');
//            });
         
//     }catch(error){
//         res.render('404_errorPage', { message: error.message });
//     }
// }

exports.index = async (req, res) => {
    try {
        let val

        console.log(req.session.userId + "..req.session.userId");
        if (req.session.userId) {
             val = { value: 0 }
        } else {
             val = { value: 1 }
        }
        console.log("session");

        // Fetch products
        const products = await productModel.find();

        // Fetch categories
        const categories = await categoryModel.find();

        res.render('index', { category: categories, prod: products, val });

    } catch (error) {
        res.render('404_errorPage', { message: error.message });
    }
}
    
  

// exports.product = (req, res) => {
//     if(req.session.userId){
//         var val = {value: 0}
//        }else{
//         var val = {value: 1}
//        }
//     axios.get('http://localhost:3000/api/product')
//         .then(productResponse => {
//             axios.get('http://localhost:3000/api/categories')
//                 .then(categoryResponse => {
//                     res.render('product', {  prod: productResponse.data, category: categoryResponse.data, val });
//                 })
//                 .catch(error => {
//                     console.error('Error fetching products:', error);
//                     res.status(500).send('Error fetching products');
//                 });
//         })
//         .catch(error => {
//             console.error('Error fetching products:', error);
//             res.status(500).send('Error fetching products');
//         });
// }

exports.product = async (req, res) => {
    try {
        let val;

        if (req.session.userId) {
            val = { value: 0 }
        } else {
            val = { value: 1 }
        }

        // Fetch products
        const products = await productModel.find();

        // Fetch categories
        const categories = await categoryModel.find();

        const offer = await offerModel.find()

        // Render the view with fetched data
        res.render('product', { prod: products, category: categories, val, offer: offer });
    } catch (error) {
        // console.error('Error fetching data:', error);
        // res.status(500).send('Error fetching data');
        res.render('404_errorPage', { message: error.message });
    }
};

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
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(passwordMatch && user.isVerified === true){
                req.session.userId = user._id;
                console.log(req.session.userId + "req.session.userId");

                res.redirect("/")
            }else{
                // res.send("<script>window.location='/login';alert(\"Wrong Password\");</script>")
                res.render('login', { message: 'Incorrect Email or Password ' })
            }
            
        }
    } catch (error) {
        // res.status(500).send('Error during login.');
        res.render('404_errorPage', { message: error.message });


    }

}

exports.user_login = (req, res) => {
    try{
        if(req.session.userId){
            res.redirect('/');
       }else{
           const val = {value: 0}
           res.render("login",{val})
       }
    }catch(error){
        res.render('404_errorPage', { message: error.message });

    }
}


exports.signup = (req, res) => {
    try{
        if(req.session.userId){
            res.redirect('/');
        }else{
            res.render("signup")
        }

    }catch{
        res.render('404_errorPage', { message: error.message });
    }
    
}

exports.logout_user = (req,res)=>{
    req.session.destroy();
    res.setHeader('Cache-Control', 'no-store');
    res.redirect("/")
}



exports.category = (req,res)=>{
    try{
        axios.get('http://localhost:3000/api/categories')
        .then(response=>{
            res.render("category",{ category: response.data })
            console.log("res",response.data);
        })
        .catch(err => {
            console.error(err);
            res.send(err)
        })
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
    
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
    try{
        if(req.session.userId){
            res.redirect('/')
       }else{
           res.render("forgotpassword")
       }

    }catch(error){
        res.render('404_errorPage', { message: error.message });
    } 
}

exports.otp = async (req,res)=>{
    try{
        if(req.session.userId){
            res.redirect('/')
       }else{
           res.render("otp")
       }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
   
}

exports.confirmPassword = async (req,res)=>{
    try{
        if(req.session.userId){
            res.redirect("/");
       }else{
           res.render("confirmPassword")
       }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

// exports.checkNumber = async (req,res)=>{
//     const data = req.body.number
//     try{
//         let result =  await userModel.findOne({number: req.body.number})
//         if(result.number === data){
//             req.session.numberId = result._id
//             // console.log(req.session.numberId);
//             res.redirect("/otp")
//         }

//     }catch(error){
//         console.log(error)
//     }
// }

exports.checkNumber = async (req, res) => {
    const data = req.body.number;

    try {
        let result = await userModel.findOne({ number: data });

        if (!result || result.number !== data) {
            res.send("<script>window.location='/forgot-password';alert('Wrong Number');</script>");
        } else {
            
            req.session.numberId = result._id;
            res.redirect("/otp");
        }
    } catch (error) {
        res.render('404_errorPage', { message: error.message });
        // Handle the error appropriately, such as sending an error response to the client
        // res.status(500).send('Internal Server Error');
    }
};

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



// exports.otpPost = async (req,res)=>{
//     try{
//         let otp = req.session.otp
//         let sessionOTP = req.body.otp
//         if(otp == sessionOTP){
//             otp =''
//             res.redirect('/confirm-password')
//             }else{
//                 otp =''
//                 res.redirect('/otp')
//                 }
//     }catch(error){
//         console.log(error)
//     }
// }

exports.otpPost = async (req,res)=>{
    try{
        let otp = req.session.otp
        let sessionOTP = req.body.otp
        if(otp !== sessionOTP){
            res.send("<script>alert(\"Wrong Password\");</script>")
        }else{
                otp =''
            res.redirect('/confirm-password')
                }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.listProduct =  (req,res)=>{
    try{
        console.log("2");
        const value = req.body.value
        console.log(value);
        // axios.get("http://localhost:3000/product/list",{params:{value}})
        productModel.find({ category: value })
            .then(response => {
                console.log(response + "res....");
                res.json(response)
            })
            .catch(error => {
                console.log(error)
            })
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.productSearch = (req,res)=>{
    try{
        const val = req.body.value
        console.log(val + "........");
        productModel.find({ productName: { $regex: val, $options: "i" } })
            .then(response => {
                console.log(response + "res....");
                // res.json(response)
                if (!response) {
                    res.status(404).send({ message: "Not found user with id" })
                } else {
                    res.json(response)
                }
            })
    .catch(error=>{
        console.log(error)
    })
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.priceFilter = async (req,res)=>{
    try{
        const val = req.body.value
        console.log(val + "bb");
        await productModel.find({})
            .sort({ price: val })
            .then(response => {
                console.log(response + "res....");
                // res.json(response)
                if (!response) {
                    res.status(404).send({ message: "Not found user with id" })
                } else {
                    res.json(response)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.myAcount = (req,res)=>{
    try{
        console.log("BEA");
        console.log(req.body);
        //validate request
    
        if (!req.body) {
            res.status(400).send({ message: "contant can not be empty!" });
            return;
        }
        console.log(req.session.userId + "sessionId....");
        if (req.session.userId) {
            console.log(req.session.userId + "sessionId");
            console.log(req.body.name + "fullname");
            console.log(req.body.number + "number");
            console.log(req.body.pincode + "pincode");
            console.log(req.body.state + "state");
            console.log(req.body.city + "city");
            console.log(req.body.house + "house");
            console.log(req.body.road + "road");
    
            //new Adress
            const user = new addressModel({
                userId: req.session.userId,
                fullname: req.body.name,
                phone1: req.body.number,
                pincode: req.body.pincode,
                state: req.body.state,
                city: req.body.city,
                houseNo: req.body.house,
                roadName: req.body.road,
            });
    
            //save user in the database
            user.save(user)
                .then((data) => {
                    res.redirect("/myAccount");
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "some error",
                    });
                });
        } else {
            res.render("login");
        }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.checkoutPost = async (req, res, next) => {
   try{
    let paymentMethod = req.body.paymentdt
    let addressId = req.body.address
    console.log(paymentMethod + "....paymentdt");
    console.log(addressId + "...selectAddress");
   
    const userid = req.session.userId;
       console.log(userid+"..userid...............2")

    const user = await userModel.findById({ _id: req.session.userId });
     console.log(user+"..user...............3")

    const value = user.cart.item.map(async (val, i) => {
        let prid = val.productId;
        console.log(prid+"...prid...............4")

        const product = await productModel.findByIdAndUpdate({ _id: prid });
        console.log(product+"...product...............5")

        let prs = product.stock;
        // console.log(prs+"..prs...............6")

        let pri = val.qty;
        // console.log(pri+"...pri...............7")
 
        product.stock = prs - pri;
        await product.save();
    });

    const Adress = await addressModel.findById({ _id: addressId });
       console.log(Adress+"...Adress............")
    //    const pay = req.body.payment
    //    const name = Adress.fullname
    //    const phone = Adress.phone1
    //    const pin = Adress.pincode
    //    const sta = Adress.state
    //    const ci = Adress.city
    //    const hno = Adress.houseNo
    //    const rna = Adress.roadName

    //    console.log(`userid=${userid}, pay=${pay}, name=${name}, phone=${phone}, pin=${pin}, sta=${sta}, ci=${ci}, hno=${hno}, rna=${rna} `)
    //    console.log(req+"req.body")

    const Orders = new orderModel({
        userId: userid,
        payment: req.body.paymentdt,
        fullname: Adress.fullname,
        phone1: Adress.phone1,
        pincode: Adress.pincode,
        state: Adress.state,
        city: Adress.city,
        houseNo: Adress.houseNo,
        roadName: Adress.roadName,
        // createdAt: true,
        status: "Order Confirmed",
        productReturned: 0,
    });

    //save Orders in the database
    Orders.save()
        .then((data) => {
            console.log("sucess");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error",
            });
        });

    user.cart.item.map(async (val, i) => {
        let productId = val.productId;
        let qty = val.qty;
        let price = val.price;

        Orders.products.item.push({ productId, qty, price });
    });

    let total = Orders.products.item.reduce((tot, val) => {
        return tot + val.price * val.qty;
    }, 0);

    Orders.products.totalPrice = total;

    const dash = await dashboardModel.findOneAndUpdate({});
        dash.order += 1;
        dash.sale += 1;
        dash.rupee += total;
        dash.profit += total;
        dash.save();

    res.redirect("/orderSucces");
   }catch(error){
    res.render('404_errorPage', { message: error.message });
   }
    
   
};

exports.pagination = async (req,res)=>{
    try{
        const values = req.body.svalue;
        console.log("s....", req.body.svalue);
        const valuel = req.body.lvalue;
        console.log("l....", req.body.lvalue);
    
        await productModel.find({})
          
            .limit(values)
    
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    console.log(data);
                    res.json(data);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });   
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
     
}


exports.shoppingCart = async (req,res)=>{
    try{
        if(!req.session.userId){
            res.redirect("/login")
        }else{
            let session = req.session.userId
            let arr = [];
            let pro = [];
            let userId = {};
            let flultotal = 0;
            userId = await userModel.findById({ _id: req.session.userId });
            user = await userModel.findByIdAndUpdate({_id: req.session.userId})
            const value = userId.cart.item.map((val) => val.productId);
            
            const fultot = userId.cart.item.map((val) => {
                const res = val.qty * val.price;
                return res;
            });
    
            flultotal = fultot.reduce((tot, val) => {
                return tot + val;
            }, 0);
    
            user.cart.totalPrice = flultotal;
            await user.save();
    
            pro = await productModel.find({ _id: { $in: value } });
            // console.log(pro + "...........pro");
            // console.log(val + "...........val");
            // console.log(sess + "...........sess");
            // console.log(user + "...........user");
            // console.log(flultotal + "...........flultotal");
            const val = {value: 0}
            res.render("shoppingCart",{ products: pro, test: val, sessval: session, user: userId, total: flultotal, val})
            
        }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
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

exports.newPasswordPost = async (req,res)=>{
    try{
        const newPassword = req.body.password;
        const result = await userModel.findByIdAndUpdate({ _id: req.session.numberId }, { $set: { password: newPassword } });
        await result.save();
        res.redirect("/login")
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }

}

exports.couponPost = async (req,res)=>{
    try{
        console.log("couponCode--post");
        const couponCode = req.body.values;
        console.log(couponCode);
        if(!couponCode){
            res.send('please enter the code')
            }else{
                
                const coupon = await couponModel.findOneAndUpdate({code : couponCode});
                coupon.usedBy.push(req.session.userId)
                await coupon.save()
                console.log(coupon.percent);
                if (!coupon) {
                    res.status(422).json({error:'Invalid Code'})
                    }else{
                        const discount = coupon.percent;
                        console.log(discount);
                        const user = await userModel.findByIdAndUpdate({_id: req.session.userId})
                        console.log(user);
                        const price = user.cart.totalPrice;
                        console.log(price);
                        const finalPrice = price - ((price*discount)/100);
                        
                        user.cart.totalPrice = finalPrice;
                        await user.save();
                        res.json({finalPrice})
                        }
                        }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.favourite = async (req,res)=>{    
    try{
        if(!req.session.userId){
            res.redirect("/login")
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
            res.render("favourite",{ products: pro,  sessval: session,  user, val})
            
        } 
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }      
}

exports.singleProduct = async (req,res)=>{
    try{
         // if(req.session.userId){
            const val = {value: 0}
            //    }else{
                // var val = {value: 1}
                // }    
            let pid=req.query.id;
            console.log(pid+"..pid")
            const user = await productModel.find({_id : pid })
            console.log(user)
            res.render("productDetails",{prod : user, val})
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.checkOut = async (req, res) => {
    try{
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

        if (!req.session.userId) {
            res.redirect("/")
        } else {

            let session = req.session.userId
            // let arr = [];
            let pro = [];
            let userId = {};
            let flultotal = 0;
            // userAddress = await addressModel.findById({userId : session})
            userId = await userModel.findById({ _id: req.session.userId });
            const value = userId.cart.item.map((val) => val.productId);
            const userAddress = await addressModel.find({ userId: session })
            const coupon = await couponModel.find({ usedBy: { $nin: [session] } })

            const fultot = userId.cart.item.map((val) => {
                const res = val.qty * val.price;
                return res;
            });

            flultotal = fultot.reduce((tot, val) => {
                return tot + val;
            }, 0);

            pro = await productModel.find({ _id: { $in: value } });

            const val = { value: 0 }
            res.render("checkOut", { products: pro, sessval: session, user: userId, total: flultotal, val, userAddress: userAddress, coupon: coupon })

        }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.myAccount = async (req,res)=>{
    try{
        if (req.session.userId) {
            const val = {value: 0}
            let id=req.session.userId;
            console.log(id+"..pid")
            // const user = await addressModel.find({userId : pid })
            // const order = await orderModel.find({userId: pid})
            // let product = order.products
        
                const user = await addressModel.find({ userId: id });
                const value = await userModel.find({ _id: id });
                const orders = await orderModel.find({ userId: id });
                const product = await productModel.find({});
        
            console.log(product)
            res.render("myAccount",{products: user, details: value, val, orders, product})
            } else {
                res.redirect('/login')
            }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}

exports.orderSucces = async (req,res)=>{
    try{
        if (req.session.userId) {
            const val = {value: 0}
            // let pid=req.session.userId;
            // console.log(pid+"..pid")
            // const user = await addressModel.find({userId : pid })
            // console.log(user)
            res.render("orderSucces",{ val})
            } else {
                res.redirect('/login')
            }
    }catch(error){
        res.render('404_errorPage', { message: error.message });
    }
} 

exports.errorPage = (req,res)=>{
    res.render("404_errorPage")
}

exports.orderStatus = async (req,res)=>{
    try{
        if (req.session.userId) {
            oderId = req.query.id;
            const val = {value: 0}
            let ret = false;
            let cancel = false;
            const orders = await orderModel.findById({ _id: oderId });
            console.log(orders+"order");
            if (orders.status == "delivered") {
                ret = true;
            }
            if (orders.status == "order confirmed" ||orders.status == "shipped") {
                cancel = true;
            }
        
            const product = await productModel.find({});
            res.render("orderStatus",{ val, orders, product, ret, cancel })

        }else{
            res.redirect("/login");
        }
    } catch(error){
        res.render('404_errorPage', { message: error.message });
    }
}


exports.addToCart = async (req, res) => {
    try{
        console.log(req.session.userId + "req.session.userId");
        if (req.session.userId) {
            console.log("hai");
            let id = req.session.userId
            let productId = req.body.id;
            const price = req.body.price;
            const singletotal = req.body.price;
            console.log(price + "isAvailable");
            const qty = 1;

            const user = await userModel.findByIdAndUpdate(id);
            console.log(user);
            if (!user) {
                throw new Error("user not found");
            }
            console.log(user);

            user.cart.item.push({ productId, qty, price, singletotal });
            user.cart.totalPrice += price * qty;
            await user.save();
        } else {
            res.render("login");
        }
    } catch (error) {
        res.render('404_errorPage', { message: error.message });
    }
}

exports.addToWishlist = async (req,res)=>{
    try {
        console.log(req.session.userId + "..req.session.userId");
        if (req.session.userId) {
            let id = req.session.userId
            let productId = req.body.id
            let price = req.body.price
            const user = await userModel.findByIdAndUpdate(id);
            console.log(user);
            if (!user) {
                throw new Error("user not found");
            }
            console.log(user);

            user.wishlist.item.push({ productId, price });
            await user.save();
        } else {
            res.render("login");

        }
    } catch (error) {
        res.render('404_errorPage', { message: error.message });
    }
}

exports.cartremove = async (req, res) => {
    try {
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
    } catch (error) {
        res.render('404_errorPage', { message: error.message });
    }
       
 }

 exports.removeWishlist = async (req, res) => {
     try {
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
     } catch (error) {
         res.render('404_errorPage', { message: error.message });
     }
       
 }

 exports.countTotal = async (req,res)=>{
    try{
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
    }catch(error){
        res.render('404_errorPage',{message:error.message});
    }
};

exports.returnReason = async (req, res) => {
    try {
        let Orders = await orderModel.findByIdAndUpdate({ _id: req.body.id });

        Orders.reason = req.body.value;
        Orders.save();
        if (Orders.reason != "product damage") {
            Orders.products.item.map(async (item) => {
                let prid = item.productId;
                let prqty = item.qty;
                console.log(prid);
                console.log(prqty);
                const product = await productModel.findByIdAndUpdate({ _id: prid });
                product.stock += prqty;
                console.log(product.stock);
                product.save();
            });
        }
        const dash = await dashboardModel.findOneAndUpdate({});
        dash.return += 1
        dash.save()

        res.json(Orders);
    } catch (error) {
        res.render('404_errorPage', { message: error.message });
    }
    
};


// Admin
// --------------------------------------------------------------------------------------------------------------------------------------



exports.dashboard = async (req, res) => {
    try{
        if(req.session.userId){
            const data = await dashboardModel.find();
            res.render("dashboard",{data:data})
        }else{
            res.redirect("/adminLogin")
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
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
        // console.log(error)
        // res.status(500).send('Error during admin login.');
        res.render("404_adminErrorPage",{message:error.message})
    }
}

exports.admin_Login = (req, res) => {
    try{
        if(req.session.userId){
            res.redirect("/adminLogin/dashboard")
        }else{
            res.render("adminLogin")
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }   
}

exports.logout_admin = (req,res)=>{
    try{
        req.session.destroy();
        res.setHeader('Cache-Control', 'no-store');
        res.redirect("/adminLogin")
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }
}


exports.addCategory = (req, res) => {
    try{
        if(req.session.userId){
            res.render("addCategory")
        }else{
            res.redirect("/adminLogin")
        } 
    }  catch(error){
        res.render("404_adminErrorPage",{message:error.message})
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
    try{
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
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }
}

exports.block_user = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await userModel.findById({ _id: id });
        if (userData.isVerified === true) {
            await userModel.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: false } }
            )
        } else {
            await userModel.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: true } }
            );
        }
        res.redirect("/adminLogin/user-table");
    } catch (error) {
        // console.log(error);
        res.render("404_adminErrorPage", { message: error.message })
    }
}

exports.user_table = (req, res) => {
    try{
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
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }
}

exports.update_user = (req, res) => {
    try{
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
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
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
    try{
        if (req.session.userId) {
            try {
                const products = await productModel.find({}).exec();
                res.render("product_table", { products });
            } catch (error) {
                // res.send(err);
                res.render("404_adminErrorPage",{message:error.message})
            }
        } else {
            res.redirect("/adminLogin");
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }
}

exports.block_product = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await productModel.findById({ _id: id });
        if (productData.isVerified === true) {
            await productModel.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: false } }
            )
        } else {
            await productModel.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: true } }
            );
        }
        res.redirect("/adminLogin/product-table");
    } catch (error) {
        // console.log(error);
        res.render("404_adminErrorPage", { message: error.message })
    }
}

exports.editProduct = async (req,res)=>{
    try{
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
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }    
}

exports.editCategory = async (req,res)=>{
    try{
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
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message})
    }
}

exports.block_category = async (req, res) => {
    try {
        const id = req.query.id
        const categoryData = await categoryModel.findById({ _id: id });
        if (categoryData.isVerified === true) {
            await categoryModel.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: false } }
            )
        } else {
            await categoryModel.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: true } }
            );
        }
        res.redirect("/adminLogin/category");
    } catch (error) {
        // console.log(error);
        res.render('404_adminErrorPage', { message: error.message })
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

exports.orderDetails = async (req,res)=>{
    try{
        const products = await productModel.find({}).exec();
        const order = await orderModel.find()
        res.render("orderDetails",{products,order})
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message});
    }
}

exports.addCoupon = (req,res)=>{
    try{
        res.render("addCoupon")
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message});
    }
    
}

// exports.addOffer = async (req,res)=>{
//     if (req.session.userId) {
//         // axios.get('http://localhost:3000/api/categories')
//         await categoryModel.find()
//             .then(response => {
//                 res.render("addOffer", { category: response.data })
//                 console.log("res", response.data);
//             })
//             .catch(err => {
//                 console.error(err);
//                 res.send(err)
//             })
//     } else {
//         res.redirect("/adminLogin")
//     }
// }

exports.addOffer = async (req, res) => {
    try {
        if (req.session.userId) {
            const categories = await categoryModel.find();
            const product = await productModel.find();
            res.render("addOffer", { category: categories, product: product });
            console.log("Categories:", categories,product);
        } else {
            res.redirect("/adminLogin");
        }
    } catch (error) {
        // console.error(err);
        // res.status(500).send("Internal Server Error");
        res.render("404_adminErrorPage", { message: error.message });
    }
};

exports.couponTable = async (req, res) => {
    try{
        if (req.session.userId) {
            try {
                const coupon = await couponModel.find({}).exec();
                res.render("coupon", { coupon });
            } catch (error) {
                // res.send(err);
                res.render("404_adminErrorPage", { message: error.message });
            }
        } else {
            res.redirect("/adminLogin");
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message});
    }
}

exports.offerTable = async (req, res) => {
    try{
        if (req.session.userId) {
            try {
                const offer = await offerModel.find({}).exec();
                res.render("offer", { offer });
            } catch (err) {
                res.send(err);
            }
        } else {
            res.redirect("/adminLogin");
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message});
    }
}

exports.editCoupon = async (req,res)=>{
    try{
        if (req.session.userId) {
            try {
                // console.log(req.query.id);
                const coupon = await couponModel.findById({_id: req.query.id}).exec();
                // console.log(coupon);
                res.render("editCoupon", { coupon });
            } catch (error) {
                // res.send(err);
                res.render("404_adminErrorPage", { message: error.message });
            }
        } else {
            res.redirect("/adminLogin");
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message});
    }
}

exports.editOffer = async (req,res)=>{
    try{
        if (req.session.userId) {
            try {
                // console.log(req.query.id);
                const offer = await offerModel.findById({_id: req.query.id}).exec();
                // console.log(coupon);
                res.render("editOffer", { offer });
            } catch (error) {
                // res.send(err);
                res.render("404_adminErrorPage", { message: error.message });
            }
        } else {
            res.redirect("/adminLogin");
        }
    }catch(error){
        res.render("404_adminErrorPage",{message:error.message});
    }
}

exports.adminErrorPage =  (req,res)=>{
    res.render("404_adminErrorPage")
}

exports.statusChange = async (req, res) => {
    try{
        console.log("........start")

        const odstatus = req.body.value
        console.log(odstatus + "odstatus")
        const idnum = req.body.idvalue
        console.log(idnum + "idnum")

        const orders = await orderModel.findByIdAndUpdate({ _id: idnum }, { status: odstatus })

        await orders.save()

        console.log(orders + "orders")

        console.log(req.body.value)
        res.json(orders)
    } catch (error) {
        res.render("404_adminErrorPage", { message: error.message });
    }
};






// exports.dash = (req,res)=>{
//     //validate request
    
//     //new user
//     const user = new dashboardModel({-
//         order : 0,
//         sale : 0,
//         rupee : 0,
//         user : 0,
//         cancell : 0,
//         return : 0,
//         order : 0,
//         orderToday : 0,
//         profit : 0,
//     })
//     //save user in database
//     user
//     .save(user)
//     .then(data=>{
//         // res.send(data)
//         res.redirect('/login')
//     })
//     .catch(err=>{
//         res.status(500).send({
//             message:err.message || "some error occured while creating a create operation"
//         });
//     });  
//  }