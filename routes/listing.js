const express=require("express");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const router=express.Router();
const wrapAsync=require("../utilis/wrapAsync.js");
const multer  = require('multer');
const {storage}=require("../cloudcongigration.js");
const upload = multer({ storage });
const listingcontrollers=require("../controllers/listing.js");

router
  .route("/")
  .get( wrapAsync(listingcontrollers.index))
  .post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(listingcontrollers.create));
 
  
  
  
  
  //new route
router.get("/new",isLoggedIn,listingcontrollers.new);
router.route("/:id")
  .put(isLoggedIn,isOwner, upload.single("listing[image]"),validateListing, wrapAsync (listingcontrollers.update))
  .delete( isLoggedIn, isOwner, wrapAsync (listingcontrollers.delete))
  .get(wrapAsync( listingcontrollers.show));
 //edit route 
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync (listingcontrollers.edit));
module.exports=router
