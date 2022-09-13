const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    image:{type:String,required:true,trim:true},
    name:{type:String,required:true},
    user:{type:String,required:true}
},{versionKey:false})

const Posts = new mongoose.model("postsData",postSchema);

module.exports = Posts;