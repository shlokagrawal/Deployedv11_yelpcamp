var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);//it will add bunch of important methods for authentication we require in future to our userschema.

module.exports = mongoose.model("User",userSchema); 