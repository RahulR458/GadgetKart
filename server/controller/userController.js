 let userDetail = require('../model/userModel');
 const bcrypt = require('bcrypt');


 //ceate and save new user
 exports.create = async (req,res)=>{
    //validate request
    if(!req.body){
        res.status(400).send({message:"content cannot be empty!"});
        return;
    }

    const {password}=req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword+"...hashedPassword");

    //new user
    const user = new userDetail({
        name : req.body.name,
        email : req.body.email,
        number : req.body.number,
        password : hashedPassword,
        isVerified : true
    })
    //save user in database
    user
    .save(user)
    .then(data=>{
        res.json(data)
        // res.redirect('/login')
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "some error occured while creating a create operation"
        });
    });  
 }

 //retrieve and return all user/ retrieve and return a songle user
 exports.find = (req,res)=>{
    if(req.query.id){
        const id = req.query.id;

        userDetail.findById(id)
            .then(data=>{
                if(!data){
                    res.status(404).send({message:"Not Found user with id"+id})
                }else{
                    res.send(data)
                }
            })
            .catch(err=>{
                res.status(500).send({message:"Error retrieving user with id"+id})
            })
    }else{
        userDetail.find()
        .then(user=>{
           res.send(user)
        })
        .catch(err=>{
           res.status(500).send({message:err.message || "Error Occurred while retriving user information"})
        })
    }
    
}

 //update a new user identified user by user id
exports.update = (req,res)=>{
    if(!req.body){
        return res
        .status(400)
        .send({message:"Data to update cannot be empty"})
    }

    const id = req.params.id
    userDetail.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
    .then(data=>{
        if(!data){
            res.status(404).send({message:`Cannot update user with $(id).Maybe user not found`})
        }else{
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error Update user information"})
    })
}

//delete a user with specified user id in the request
exports.delete = (req,res)=>{
     const id = req.params.id;

     userDetail.findByIdAndDelete(id)
     .then(data=>{
        if(!data){
            res.status(404).send({message:`Cannot Delete with id $(id). May be Worng`})
        }else{
            res.send({
                message : "User was deleted successfully!"
            })
        }
     })
     .catch(err=>{
        res.status(500).send({
            message:"Could not delete user with id + "+id
        });
     });
}