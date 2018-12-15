var mongoose=require("mongoose");
var Post=require("./models/post");

function seedDB(){

Post.remove({},function(err){
        if(err)
            console.log(err);
    });    
} 

module.exports=seedDB();
