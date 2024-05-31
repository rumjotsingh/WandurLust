//step the express app
if(process.env.NODE_ENV!="production"){
   require('dotenv').config()
}


const  express = require('express');
const app = express();
const path=require("path");
const mongoose=require("mongoose");
const port = 8080;

const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const { error } = require('console');

//usage of app
app.set("views engine","ejs");
app.set("views",path.join((__dirname,"views")));
app.use(express.urlencoded({extended:true}));

app.listen(8080,(req,res)=>{
   console.log("the sever is listening up port 8080");
});
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname , "/public")));



//connect with database
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ALTASDB_URL
main().then(()=>{console.log("connected to db")}).catch((err) =>{ console.log(err)});
async function main() {
  await mongoose.connect(dburl);
}
const store=MongoStore.create({
   mongoUrl:dburl,
   crypto:{
      secret:process.env.SECRET,
   },
   touchAfter:24*60*60,
 });
 store.on("error",()=>{
   console.log("eror",error);
 })
//session options 
const sesionOptions={
   store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
      httpOnly:true,
      maxAge:1000*60*60*24*7,
      expires:Date.now()+1000*60*60*24*7
   }
 };


app.use(session(sesionOptions));
app.use(flash());
//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
   res.locals.Sucess=req.flash("Sucess");
   res.locals.error=req.flash("error");
   res.locals.CurrUser=req.user;
   next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




//middle ware
app.use((err,req,res,next)=>{
  let{ statuscode=500,message="something went wrong"}=err;
   res.status(statuscode).render("error.ejs",{message});

});







