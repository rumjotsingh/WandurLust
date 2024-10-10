 const Listing=require("./models/listing");
 const ExpressError=require("./utilis/ExpressError.js");
 const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      // console.log(req.path,"..",req.originalUrl);
       req.session.redirect=req.originalUrl;
        req.flash("error","You must be logged in create new listing" );
       return res.redirect("/login");
     }
     next();
     
};
module.exports.saveRedirectUrl=(req,res,next)=>{
 
 
  if( req.session.redirect){
    res.locals.redirect=req.session.redirect;
    }
      next();
};
module.exports.isOwner= async(req,res,next)=>{
  let {id }=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.CurrUser._id)){
      req.flash("error","You are not owner of this listing");
      return res.redirect(`/listings/${id}`);
  } 
  next();
}
module.exports.validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
 
  if(error){
     let errmsg=error.details.map((el)=>{return el.message}).join(",");
     throw new ExpressError(400,errmsg);
  }else{
     next();
  }
};
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
   
    if(error){
       let errmsg=error.details.map((el)=>{return el.message}).join(",");
       throw new ExpressError(400,errmsg);
    }else{
       next();
    }
 };
 module.exports.isAuthorReview= async(req,res,next)=>{
  let { id,reviewId }=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.CurrUser._id)){
      req.flash("error","You  are not the author of review ");
      return res.redirect(`/listings/${id}`);
  } 
  next();
}
