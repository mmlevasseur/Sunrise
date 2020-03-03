var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Sunspot not found");
				res.redirect("back");
			} else {
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "Incorrect user credentials to complete request")
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Must be logged in");
		res.redirect("back");
	}
}

middlewareObj.checkProfileOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user.id, function(err, foundProfile){
			if(err || !foundProfile){
				req.flash("error", "Profile not found");
				console.log(err);
				res.redirect("back");
			} else {
				//does user own the profile?
				if(foundProfile.username === req.user.username){
					next();
				} else {
					req.flash("error", "Incorrect user credentials to complete request");
					console.log(err);
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Must be logged in");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "Incorrect user credientials to complete request")
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Must be logged in");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Must be logged in");
	res.redirect("/login");
}


module.exports = middlewareObj;