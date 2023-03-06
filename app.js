const express = require('express');
const bodyparser= require('body-parser');
const encrypt = require('mongoose-encryption');
const ejs= require("ejs");

var app=express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


const mongoose= require("mongoose");
mongoose.connect("mongodb://localhost:27017/secrets");
const trySchema= new mongoose.Schema({
    email:String,
    password:String
});
const secret="thisislittlesecret.";
trySchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const item=mongoose.model("second",trySchema);

app.get("/", function(req,res){
    res.render("home");
});


app.post("/register", async function(req, res) {
    const newuser = new item({
      email: req.body.username,
      password: req.body.password
    });
    try {
      await newuser.save();
      res.render("secrets");
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    try {
      const foundUser = await item.findOne({ email: username });
      if (foundUser && foundUser.password === password) {
        res.render("secrets");
      }
    } catch (error) {
      console.log(error);
    }
  });
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register")
});

app.listen(5000,function(){
    console.log("server started");
});