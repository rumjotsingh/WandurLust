const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECERT
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wandurlust_dev',
      allowedforamt:["png","jpeg","jpg"],
      
    },
  });
   module.exports={
    cloudinary,storage
   }
