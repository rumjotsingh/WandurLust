const Listing=require("../models/listing");
module.exports.index=async (req,res)=>{
    let allistings=await Listing.find({});
    res.render("listings/index.ejs", { allistings });
 };
 module.exports.new=(req,res)=>{
    if(!req.isAuthenticated()){
       req.flash("error","you must be logged in create new listing" );
      return res.redirect("/login");
    }
   res.render("listings/new.ejs");
};
module.exports.show=async (req,res)=>{
    let {id }=req.params;
      const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
      
      if(!listing){
         req.flash("error","Listing  you requested does not exist");
         res.redirect("/listings");
      }else{
      res.render("listings/show.ejs", { listing });
   };
};
module.exports.create=async (req,res,next)=>{
   let url=req.file.path;
   let filename=req.file.filename;

    const newlisting =new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await  newlisting.save();
    req.flash("Sucess","New Listing Created");
    res.redirect("/listings");
};
module.exports.edit=async(req,res)=>{
    let {id }=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
     req.flash("error","Listing  you requested does not exist");
     res.redirect("/listings");
  }let originalimage=listing.image.url;
  let originalimageurl=originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalimageurl });
  };
  module.exports.update=async (req,res)=>{
    let {id }=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
   }
   
    req.flash("Sucess","Listing Updated");
    res.redirect(`/listings/${id}`);
 };
 module.exports.delete=async (req,res)=>{
    let{id}=req.params;
    let deletedlist= await Listing.findByIdAndDelete(id);
   
    req.flash("Sucess","Listing Deleted");
    res.redirect("/listings");
 
 };