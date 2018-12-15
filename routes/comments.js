var express = require("express");
var router=express.Router({mergeParams: true});
var Post=require("../models/post")
var Comment=require("../models/comment")

//----------------
// COMMENT ROUTES
//----------------

router.get("/new", isLoggedIn ,function(req, res) {
    //find post by id
    Post.findById(req.params.id, function(err,post){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{post: post});
        }
    });
  
});


// comments create
router.post("/", isLoggedIn ,function(req,res){ 
   // looking up post using ID
   Post.findById(req.params.id, function(err, post) {
       if(err){
           console.log(err);
           res.redirect("/posts");
       }else{
           Comment.create(req.body.comment, function(err,comment){
               if(err){
                   console.log(err);
               }else {
                  //add username and id 
                  comment.author.id= req.user._id;
                  comment.author.username=req.user.username;
                  comment.save();
                  console.log(req.user.username);
                   
                  post.comments.push(comment);
                  post.save();
                  
                  res.redirect('/posts/'+post._id);
               }
               }
           );
       }
   });
   
    
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 

module.exports=router;