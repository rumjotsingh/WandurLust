//step the express app
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const listingcontrollers = require("./controllers/listing.js");
const { error } = require("console");

app.set("views engine", "ejs");
app.set("views", path.join((__dirname, "views")));
app.use(express.urlencoded({ extended: true }));
app.listen(8080, (req, res) => {
  console.log("the sever is listening up port 8080");
});
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));
const MONGO_URL =
  "mongodb+srv://rumjotsingh12345:BfzO29fk3ZrrpXEp@wandurlust.srosi.mongodb.net/";
// const dburl = process.env.ALTASDB_URL;
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", () => {
  console.log("eror", error);
});
//session options
const sesionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sesionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.Sucess = req.flash("Sucess");
  res.locals.error = req.flash("error");
  res.locals.CurrUser = req.user;
  next();
});
app.get("/", listingcontrollers.index);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Static pages routes
app.get("/about", (req, res) => {
  res.render("static/about.ejs");
});
app.get("/privacy", (req, res) => {
  res.render("static/privacy.ejs");
});
app.get("/terms", (req, res) => {
  res.render("static/terms.ejs");
});
app.get("/help", (req, res) => {
  res.render("static/help.ejs");
});
app.get("/contact", (req, res) => {
  res.render("static/contact.ejs");
});
app.get("/careers", (req, res) => {
  res.render("static/careers.ejs");
});
app.get("/press", (req, res) => {
  res.render("static/press.ejs");
});
app.get("/blog", (req, res) => {
  res.render("static/blog.ejs");
});
app.get("/safety", (req, res) => {
  res.render("static/safety.ejs");
});
app.get("/cancellation", (req, res) => {
  res.render("static/cancellation.ejs");
});
app.get("/cookies", (req, res) => {
  res.render("static/cookies.ejs");
});
app.get("/sitemap", (req, res) => {
  res.render("static/sitemap.ejs");
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "something went wrong" } = err;
  res.status(statuscode).render("error.ejs", { message });
});
