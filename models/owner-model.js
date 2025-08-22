const mongoose = require("mongoose");



const ownerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    
    
    product:{
        type: Array,
        default: []
    },
    contact: Number,
    picture: String,
    gsitn: String
});

module.export= mongoose.model("owner", ownerSchema);