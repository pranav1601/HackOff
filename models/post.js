var mongoose=require("mongoose");

var postSchema=new mongoose.Schema({
    name: String,
    image: String,
    likes: Number,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
        nposts: Number,
        nfriends: Number
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports=mongoose.model("Post",postSchema);
