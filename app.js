const express = require("express");
const app = express();

const cookeiParser = require("cookie-parser");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookeiParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res) =>{
    res.send("hey");
});

app.listen(3030);