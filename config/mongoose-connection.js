const mongoose = require("mongoose");

const dbgr = require("debug")("development:mongoose");
const config = require("config");

mongoose.connect(process.env.MONGO_URI)
.then(function(){
    dbgr("connected"); 
    
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;