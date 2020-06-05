const path = require("path");
const multer = require("multer");
const express = require("express");
var username = "default";
/*

const storage = multer.diskStorage({
   destination: "../public/" + req.params.username + "/",

   filename: function(req, file, cb){
      cb(null,"IMAGE-" +  req.params.username + path.extname(file.originalname));
   }
});

const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("myImage");

*/

const router = express.Router();



router.post('/upload/:username', function (req, res) {

  const storage = multer.diskStorage({
     destination: "../public/" + req.params.username + "/",

     filename: function(req, file, cb){
        cb(null,"IMAGE-" +  req.params.username + path.extname(file.originalname));
     }
  });

  const upload = multer({
     storage: storage,
     limits:{fileSize: 1000000},
  }).single("myImage");



  upload(req, res, function (err) {
    console.log("Request ---", req.body);
    console.log("request file ---", req.file);
    if(!err) {
      return res.sendStatus(200).end();
    }
  });
});

router.get('/retrieve', function (req, res) {
  const formData = new FormData();
  formData.append('myImage', e);
  const config = {
          headers: {
              'content-type': 'multipart/form-data',
          }
      };
});







module.exports = router;
