var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash   =   require("connect-flash"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requiring routes    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");


mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true});
// mongoose.connect('mongodb+srv://shlokagrawal:Shlok@123@cluster0-ua7xp.mongodb.net/test?retryWrites=true&w=majority',{
//     useNewUrlParser: true,
//     useCreateIndex: true
// }).then(function(){
//     console.log("Connected To MongoDB Atlas Cloud Database!");//mongoDB cloud database as service
// }).catch(err => {
//     console.log("ERROR:",err.message);
// });

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//our own middleware any function will provide to it will work on every route refer lecture 342 and scetion 35 for understanding
app.use(function(req,res,next){
    // res.locals.currentUser it will be send to every ejs templates we not have to manually add this currentUser:req.user to every ejs template  .
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//using the routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);//for better understanding refer section 36 and lecture 343.
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp V11 Server Has Started!!");
});