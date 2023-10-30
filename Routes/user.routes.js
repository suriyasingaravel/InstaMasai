const express= require("express");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");

const {UserModel} = require("../Model/user.model");

const userRouter = express.Router();

userRouter.post("/register", async(req,res)=>{
     const {name, email, gender, password, age, city, is_married} = req.body;
    try {
        const check=await UserModel.findOne({email});
        if(check){
            return res.status(409).send({"msg":"User already exist, please login"});
        }
        else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(401).send({"msg": "Not able to generate hash password", "error":err});
                }
                else{
                    const user = new UserModel({
                        name: name,
                        email:email,
                        password: hash,
                        gender:gender,
                        age:age,
                        city:city,
                        is_married:is_married
                        });
                        await user.save()
                        res.status(200).send({"msg":"The new user has been registered", "newUser":user});
                    }
                    
                    })
        }
        
        }
    

    catch (error) {
        res.status(401).send({"msg": "Can't register new User", "error":err});
    }
})


userRouter.post("/login", async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user=await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token = jwt.sign({name:user.name, userID:user._id},"masai");
                    res.status(200).send({"msg":`Login Successful!, Hello, ${user.name} Welcome!`,"token":token});
                }
                else{
                    return  res.status(401).send({"msg":"Wrong Credentials!"});
                }
            })
        }
        else{
            return res.status(401).send({"msg":"No such user found!"});
        }
    } 
    catch (error) {
         res.status(400).send({"error":error});
    }
})





module.exports={userRouter}
