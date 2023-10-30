const express= require("express");
const {PostModel}= require("../Model/post.model");
const {auth} = require("../Middlewares/auth.middleware");

const postRouter= express.Router();

postRouter.use(auth);

//Post new post
postRouter.post("/add", async(req,res)=>{
   try {
      const post = new PostModel(req.body);
      await post.save();
      res.status(201).send({"msg":"Post added successfully", "Post":post});
   } 
   catch (error) {
     res.status(401).send({"error":error}); 
   } 
})

//Get all posts
postRouter.get("/", async(req,res)=>{
    try {
        const query={};
        if(req.query.title){
            query.title={$regex:req.query.title, $options:"i"};
        }
        const page= parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit) || 3;
        const skip=(page-1)*limit;

        const sortField= req.query.sortBy || "no_of_comments";
        const sortOrder = req.query.sortOrder || "asc";

       const posts=await PostModel.find({name:req.body.name});
       res.status(200).send({"Posts":posts})
    } 
    catch (error) {
        res.status(401).send({"error":error}); 
    } 
 })

postRouter.get("/top", async(req,res)=>{
    try {
        const posts=await PostModel.find({name:req.body.name}).sort({no_of_comments:-1}).limit(1);
        res.status(200).send({"Posts":posts})
     } 
     catch (error) {
         res.status(401).send({"error":error}); 
     } 
  })




 //Patch post
 postRouter.patch("/update/:postID", async(req,res)=>{
    const {postID}= req.params;
   

    try {
        const post = await PostModel.findOne({"_id":postID});
        if(req.body.userID=== post.userID){
            await PostModel.findByIdAndUpdate({"_id":postID},req.body);
            res.status(200).send({"msg":"Post updated successfully"});
        }
        else{
           res.status(401).send({"msg":"You are not authorized to update this post"});
        }
    } 
    catch (error) {
        res.status(401).send({"error":error}); 
    } 
 })

//delete Post
 postRouter.delete("/delete/:postID", async(req,res)=>{
    const {postID}= req.params;
    try {
        const post = await PostModel.findOne({"_id":postID});
        if(req.body.userID=== post.userID){
            await PostModel.findByIdAndDelete({"_id":postID});
            res.status(200).send({"msg":"Post Deleted successfully"});
        }
        else{
            res.status(401).send({"msg":"You are not authorized to update this post"});
         }
    } 
    catch (error) {
        res.status(401).send({"error":error}); 
    } 
 })

 module.exports={postRouter}