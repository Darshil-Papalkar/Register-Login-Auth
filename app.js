//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: username,
        password: password
    });

    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log("Successfully registered user");
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            if(result){
                if(result.password === password){
                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000, function(){
    console.log("App started on port 3000");
});
