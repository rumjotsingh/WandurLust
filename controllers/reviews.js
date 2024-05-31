
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.newReviews=async (req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReviews= new Review(req.body.review);
    newReviews.author=req.user._id;
    listing.reviews.push(newReviews);
     await newReviews.save();
     await listing.save();
     req.flash("Sucess","New Review Created");
     res.redirect(`/listings/${listing._id}`);
 };
 module.exports.deleteReviews=async (req,res)=>{
    let {id,reviewId}=req.params;
 
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   await Review.findByIdAndDelete(reviewId);
   req.flash("Sucess","Review Deleted");
   res.redirect(`/listings/${id}`);
 };
 