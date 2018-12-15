var express = require("express");
var router=express.Router();
var Post=require("../models/post");

// INDEX showing all posts
router.get("/",function(req,res){
    
    Post.find({},function(err,allPosts){
        if(err){
            console.log(err)
        }else{
            //Logic for sorting posts:
            allPosts = arrange(allPosts);

            //Call to ejs file to show all elements of 'allposts'
            res.render("posts/index",{posts:allPosts});
        }
    });
    // res.render("posts",{posts:posts});
    
});

router.post("/", isLoggedIn ,function(req,res){
    
    //getting data from The form and adding it to database
    var name = req.body.name;
    var image = req.body.image;
    var likes = 0;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username,
        nfriends: 0,
        nposts: 0
    };

    var newPost = { name: name, image: image, likes: likes, description: desc, author: author };

    //creating a new post and saving in the database
    
    Post.create(newPost,function( err, newlyCreated){
        if(err)
            console.log(err);
        else
            res.redirect("/posts");
    });
 
});

router.get("/new", isLoggedIn ,function(req, res) {
    res.render("posts/new.ejs");
});

router.get("/:id",function(req, res) {
    
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err)
            console.log(err);
        else
            res.render("posts/show",{post: foundPost});
    });    
});

//LIKE:
router.get("/:id/like", function (req, res) {
    Post.findById(req.params.id).exec(function (err, foundPost) {
        if (err)
            console.log(err);
        else {
            foundPost.likes += 1;
            Post.update({ _id: foundPost._id }, foundPost, function (err, val) {
                if (err)
                    console.log(err);
                else
                    res.redirect("/posts/" + req.params.id);
            });
        }
    });
});

//EDIT
router.get("/:id/edit",checkPostOwnership,function(req, res) {
    //if logged in
    Post.findById(req.params.id ,function(err, foundPost){
       res.render("posts/edit",{post: foundPost});
    });
    
});


//UPDATE

router.put("/:id",checkPostOwnership ,function(req,res){
    //find and update
    Post.findByIdAndUpdate(req.params.id,req.body.post,function(err, updatedPost){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts/"+req.params.id);
        }
    });
});

//DESTROY Posts

router.delete("/:id",checkPostOwnership ,function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 
function checkPostOwnership(req,res,next){
    if(req.isAuthenticated()){
      
        Post.findById(req.params.id ,function(err, foundPost){
        if(err){
            res.redirect("back");
        } else {
              //does user own it
        
            if(foundPost.author.id.equals(req.user._id)){
               next();
            } else {
                res.redirect("back");
            }
            
            
        }
    });
    } else {
        res.redirect("back");
    }
}


function arrange(inputs) {
    var All = [], final = [];

    inputs.forEach(function (input) {
        var ND = {
            pid: input._id,
            ncoms: input.comments.length,
            nlikes: input.likes,
            author: {
                nposts: input.author.nposts,
                nfriends: input.author.nfriends
            },
        };

        ND.weight = 0.4 * ND.nlikes + 0.3 * ND.ncoms + 0.2 * ND.author.nfriends + 0.1 * ND.author.nposts;
        All.push(ND);
    });

    All.sort(function (a, b) {
        return b.weight - a.weight;
    });

    All.forEach(function (val) {
        inputs.forEach(function (input) {
            if (val.pid == input._id)
                final.push(input);
        });
    });
    return final;
}


module.exports=router;