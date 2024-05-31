const express=require("express");
const passport = require("passport");
const wrapAsync=require("../utilis/wrapAsync.js");
const router=express.Router();
const {saveRedirectUrl}=require("../middleware.js");
const usercontrollers=require("../controllers/user.js");
router.route("/login")
.get(usercontrollers.renderlogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usercontrollers.userauth);


router.route("/signup")
.get(usercontrollers.rendersignup)
.post( wrapAsync(usercontrollers.signup));


router.get("/logout",usercontrollers.logout);
module.exports=router;