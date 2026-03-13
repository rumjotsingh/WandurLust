
const User=require("../models/user.js");
const passport = require("passport");
module.exports.signup=async(req,res)=>{
    try{let{username,password,email}=req.body;
    const newUser=new User({email,username});
  const registeredUser= await User.register(newUser,password);
  
  req.login(registeredUser,(err)=>{
    if(err){ 
      return next(err);
    }
    req.flash("Sucess",`Welcome to WandurLust, ${username}! 🚀`);
    res.redirect("/listings");
  });
  
}catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
  }
   
};
module.exports.rendersignup=(req,res)=>{
    res.render("users/signup.ejs");
 };
 module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.userauth=async(req,res)=>{
    req.flash("Sucess",`Welcome back, ${req.user.username}! 🎉`);
    let redirecturl=res.locals.redirect || "/listings";
    res.redirect(redirecturl);
};
 
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
     if(err){
      return next(err);
     }
     req.flash("Sucess","Successfully logged out. See you soon! 👋");
     res.redirect("/listings");
    });
};

module.exports.demoLogin = async (req, res, next) => {
    try {
        // Check if demo user exists
        let demoUser = await User.findOne({ username: "demo" });
        
        // If demo user doesn't exist, create it
        if (!demoUser) {
            demoUser = new User({
                email: "demo@wandurlust.com",
                username: "demo"
            });
            await User.register(demoUser, "demo123");
            console.log("✅ Demo user created automatically");
        }
        
        // Now authenticate with passport
        req.body.username = "demo";
        req.body.password = "demo123";
        
        // Use passport's authenticate method
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, () => {
            req.flash("Sucess", "Welcome to Demo Mode! 🚀 Explore WandurLust freely.");
            res.redirect("/listings");
        });
        
    } catch (err) {
        console.error("Demo login error:", err);
        req.flash("error", "Demo login failed. Please try again.");
        res.redirect("/login");
    }
};

module.exports.renderProfile = (req, res) => {
    res.render("users/profile.ejs");
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Update user email
        await User.findByIdAndUpdate(req.user._id, { email });
        
        req.flash("Sucess", "Profile updated successfully! ✨");
        res.redirect("/profile");
    } catch (err) {
        req.flash("error", "Failed to update profile. Please try again.");
        res.redirect("/profile");
    }
};
