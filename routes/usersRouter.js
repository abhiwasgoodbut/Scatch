const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");

router.get("/",function(req,res){
    res.send("hey");
});

router.post("/register", async function(req,res){
    try {
        let {email,fullname,password} = req.body;
    
    let user = await userModel.create({
        email,
        password,
        fullname,
    });

    res.send(user);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;