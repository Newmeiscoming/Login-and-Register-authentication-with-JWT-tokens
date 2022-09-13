const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String,required:true,trim:true}
},{versionKey:false})

const Credentials = new mongoose.model("userdata",userSchema);

module.exports = Credentials;