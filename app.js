const express = require("express");
const app = express();

const cookeiParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const index = require("./routes/index");
const payment = require("./routes/payment");

require("dotenv").config()

const db = require("./config/mongoose-connection");

app.set('view engine', "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookeiParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);

app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/payment", payment)
app.use("/", index);

app.listen(process.env.PORT);