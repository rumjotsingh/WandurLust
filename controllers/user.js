
const User=require("../models/user.js");
module.exports.signup=async(req,res)=>{
    try{let{username,password,email}=req.body;
    const newUser=new User({email,username});
  const registeredUser= await User.register(newUser,password);
  
  req.login(registeredUser,(err)=>{
    if(err){ 
      return next(err);
    }
    req.flash("Sucess","Welcome to Wandurlust");
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
    req.flash("Sucess","Welcome to back Wandurlust ! ");
    let redirecturl=res.locals.redirect || "/listings";
    res.redirect(redirecturl);
   
};
 
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
     if(err){
      return next(err);
     }
     req.flash("Sucess","you are logged out!");
     res.redirect("/listings");
    });
};
