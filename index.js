const express = require("express");
require('dotenv').config()
const {connection} = require("./db")
const{userRouter}= require("./Routes/user.routes");
const {postRouter} = require("./Routes/post.routes");
const cors= require("cors");
const {BlacklistModel} = require("./Model/blaklist.model")

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts",postRouter);
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).send({"msg":"Welcome to my website"});
})

app.get("/logout", async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    try {
       const blacklistUser = new BlacklistModel({
        token:token
       })
       await blacklistUser.save();
       res.status(200).send({"msg":"User has been Logged out!!"})
    } 
    catch (error) {
        res.status(400).send({"error":error});
    }
})

app.listen(process.env.port,async()=>{
   try {
       await connection;
       console.log(`server connected to Database successfully`);
       console.log(`server Running at port successfully`);

   } 
   catch (error) {
       console.log(error)
   }
})