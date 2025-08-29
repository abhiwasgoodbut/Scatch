const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();

router.get("/", function(req,res){
    let error = req.flash("error");
    res.render("index",{ error });
});

router.get("/shop", isLoggedIn, function(req,res){
      const products = [
        { name: "Shoes", price: 1200, bgcolor: "#f5f5f5", image: Buffer.from("") },
        { name: "Watch", price: 3000, bgcolor: "#e0f7fa", image: Buffer.from("") }
    ];
    res.render("shop", { products });
})

module.exports = router;