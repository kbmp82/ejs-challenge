//jshint esversion:6

const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//connect to MongoDB cloud
mongoose.connect("mongodb+srv://admin-kevin:Digital09@cluster0-msg0g.mongodb.net/blogDB",{useNewUrlParser: true});

//create itemScheme
const postsSchema = {
  topic: String,
  posts: [{
    title: String,
    body: String
  }]
};


const Post = mongoose.model("Post", postsSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let allPosts = [];
app.get("/",function(req, res){
  Post.find({}, function(err, results) {
    if(!err){
      if(results.length != 0){
        allPosts = results;
        //console.log(results);
      }
    }
    res.render("home",{homeStartingContent:homeStartingContent, posts:allPosts});
  });


});
app.get("/posts/:topic",function(req,res){
  const topic = _.lowerCase(req.params.topic);
  //console.log(topic);

  Post.findOne({topic:topic}, function(err, results) {
    //console.log(results);
    if(!results){
      res.redirect("/");
    }else{
      //console.log(results.posts);
     res.render("post",{posts:results.posts});
    }
  });

});
app.get("/about",function(req, res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req, res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req, res){
  res.render("compose");
});

app.post("/compose",function(req, res){
const topic = _.lowerCase(req.body.topic);
const title = _.startCase(_.camelCase(req.body.postTitle));
const body = req.body.postBody;
const postBody = [{
  title: title,
  body: body
}];
  const newPost = new Post({
    topic: topic,
    posts: postBody
  });

  Post.findOne({topic: topic},function(req,foundTopic){
  if(!foundTopic){
    newPost.save(function(err){
      if(!err){
        res.redirect("/posts/"+topic);
      }
    });

  }else{
    Post.findOneAndUpdate({topic:topic},{$push:{posts:{title:title,body:body}}},function(err){
      if(!err){
        console.log('successfully updated');
      }else{
        console.log("opp---------- "+err);
      }
  });
    //foundTopic.posts.push(postBody);
  //  foundTopic.save();
    res.redirect("/posts/"+topic);
  }
});

});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port "+port);
});
