const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const { useReducer } = require("react");
const router = express.Router();

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/cart",isLoggedIn,async function(req,res){
  let user = await userModel
  .findOne({email: req.user.email})
  .populate("cart");
  // console.log(user.cart);
  
  res.render("cart",{user});
})

router.get("/shop", isLoggedIn, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/admin", function (req, res) {
  res.render("admin");
});
module.exports = router;
