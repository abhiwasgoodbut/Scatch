const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const { useReducer } = require("react");
const router = express.Router();
require("dotenv").config();

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  // calculate totals
  let subtotal = 0;
  user.cart.forEach(item => {
    subtotal += item.price; // assuming each product has a `price`
  });

  let discount = 20; // sample discount
  let shipping = 20; // sample shipping charge
  let netTotal = subtotal + shipping - discount;

  res.render("cart", {
    user,
    cart: user.cart,
    subtotal,
    discount,
    shipping,
    netTotal,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID, // pass key to frontend
  });
});

router.post("/cart/remove/:id", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) return res.status(404).send("User not found");

    // Remove product by ID (cart is assumed to store ObjectIds)
    user.cart.pull(req.params.id);

    await user.save();

    res.redirect("/cart"); // back to cart page
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong while removing item");
  }
});

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
