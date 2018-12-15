var express = require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
});



//-------------------------
// AUTH ROUTES
//-------------------------

// register_form
router.get("/register",function(req, res) {
    res.render("register");
});

//Handling Signup
router.post("/register",function(req, res) {
    var newUser=new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/posts");
        });
    });
});


//show login  form
router.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/posts",
        failureRedirect: "/login"
    }),function(req, res) {
    
});
 
//logout route
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/posts");
});
 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;
 