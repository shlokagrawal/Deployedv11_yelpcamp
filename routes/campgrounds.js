//routes for campgrounds.
//we will add router we will not do this var express = require("express"), var app = express();
//we will do new thing which is router.
var express = require("express");

var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")
//now replace app with the route


//index route- show all campgrounds.
router.get("/",function(req,res){
    //get all campgrounds from DB.
    Campground.find({},function(err,campgrounds){
        if(err)
        console.log(err);
        else{
            console.log("all campgrounds from database"); 
            res.render("campgrounds/index",{campgrounds:campgrounds, page: 'campgrounds'});   //currentUser:req.user
        }
    });
    //res.render("campgrounds",{campgrounds:campgrounds});//this statement was used for accesing array which we have commented.
});

//create route-add new campground to db
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {id:req.user._id, username:req.user.username}
    var newCampground = {name:name, price:price, image:image, description:desc, author:author};
    // campgrounds.push(newCampground); this was used for our hardcoded array now we are using database so we dont need it anymore.
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");        
        }
    });
    
});

//new route - show form to create new route
router.get("/new",middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new"); 
});

//show route - show more info about one campground.
router.get("/:id",function(req, res) {
   
   Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){//see lecture 324,section 33 if you don't understand this line.
      if(err)
      {
          console.log(err);
      }
      else
      {
         res.render("campgrounds/show",{campground : foundCampground}); 
      }
   });
});


//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});  
    });//all previous code was removed because we had written that code in middleware.
});
  
  

//update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else
       {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       } else
       {
           res.redirect("/campgrounds");
       }
    });
});

//middleware
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){
//           Campground.findById(req.params.id,function(err,foundCampground){
//           if(err){res.redirect("back");}
//           else
//           {
//               //does user own the campground?
//               if(foundCampground.author.id.equals(req.user._id)){
//                     next();    
//               }else{
//                   res.redirect("back");
//               }
               
//           }
//       });
//   }else{
//           //if not redirect
//          // res.send("you need to be logged in to do that!");
//          res.redirect("back");
//   }
// }

module.exports = router;