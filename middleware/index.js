//all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    // function checkCampgroundOwnership(req,res,next){
        if(req.isAuthenticated()){
               Campground.findById(req.params.id,function(err,foundCampground){
               if(err){
                   req.flash("error","Campground Not Found!");
                   res.redirect("back");
               }
               else
               {
                   //does user own the campground?
                   if(foundCampground.author.id.equals(req.user._id)){
                        next();    
                   }else{
                       req.flash("error","You Don't Have Permission To Do That!");    
                       res.redirect("back");
                   }
                   
               }
           });
       }else{
              //if not redirect
             // res.send("you need to be logged in to do that!");
             req.flash("error","You Need To Be LoggedIn To Do That!");
             res.redirect("back");
       }
}


middlewareObj.checkCommentOwnership = function(req,res,next){
    // function checkCommentOwnership(req,res,next){
        if(req.isAuthenticated()){
               Comment.findById(req.params.comment_id,function(err,foundComment){
               if(err){res.redirect("back");}
               else
               {
                   //does user own the comment?
                   if(foundComment.author.id.equals(req.user._id)){
                        next();    
                   }else{
                       req.flash("error","You Don't Have Permission To Do That!");
                       res.redirect("back");
                   }
                   
               }
           });
       }else{
              //if not redirect
             // res.send("you need to be logged in to do that!");
             req.flash("error","You Need To Be LoggedIn To Do That!");
             res.redirect("back");
       }
}


middlewareObj.isLoggedIn = function(req,res,next){
    // function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Need To Be LoggedIn To Do That!");
    res.redirect("/login");
}    

module.exports = middlewareObj;