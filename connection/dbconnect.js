const mongoose = require("mongoose");

const Connection = async (url)=>{
    try {
        mongoose.connect(url,()=>{
            console.log("Connection established with database");
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = Connection;