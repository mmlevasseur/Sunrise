var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");


//Root Route
router.get("/", function(req, res){
	res.render("landing");
});

//show register form
router.get("/register", function(req, res){
	res.render("register", {page: "register"});
});

//handle register logic
router.post("/register", function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar,
		bio: req.body.bio,
		author: {
			id: req.user._id,
			}
		});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Sunrise " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You successfully logged out");
	res.redirect("/campgrounds");
});

// USER PROFILES
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("/");
		}
		Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("/");
			}
		res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});
	});
});

//User edit route
router.get("/users/:id/edit", middleware.checkProfileOwnership, function(req, res){
	User.findById(req.user.id, function(err, foundUser){
		res.render("users/edit", {user: foundUser});
	});
});
//User update route
router.put("/users/:id", middleware.checkProfileOwnership, function(req, res){
	User.findByIdAndUpdate(req.user.id, req.body.user, function(err, updateBio){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/users/" + req.user.id);
		}
	});
});


module.exports = router;