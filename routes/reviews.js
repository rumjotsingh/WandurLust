const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilis/wrapAsync.js");
const reviewcontrollers=require("../controllers/reviews.js");
const {validateReview, isLoggedIn,isAuthorReview}=require("../middleware.js");
//post route the reviews
router.post("/",isLoggedIn,validateReview,  wrapAsync(reviewcontrollers.newReviews));
 //deleter the review route 
 router.delete("/:reviewId",isLoggedIn,isAuthorReview,wrapAsync(reviewcontrollers.deleteReviews));
 module.exports=router