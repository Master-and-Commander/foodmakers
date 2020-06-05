const router = require('express').Router();
const mongoose = require('mongoose');
let User = require('../models/user.model');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId;

router.route('/').get((req, res) => {
   User.find()
     .then(users => res.json(users))
     .catch(err => res.status(400).json('Errors: ' + err));
});

router.route('/fetchusername/:id').get((req, res)=> {
  User.findById(req.params.id).then((data) => {
    res.send(data["username"]);
  }).catch(err => res.status(400).json("Error fetching username: " + err ));
});

router.route('/fetchspecialties/:id').get((req, res) => {
  User.findById(req.params.id).then((data) => {
    res.send(data["specialties"]);
  });
});

router.route('/removeitemfromeatlist/:id/:item').post((req,res) => {
  var arr = [];
  User.findById(req.params.id).then((data) => {
    arr = data["toEat"];
    var array = arr.splice( arr.indexOf(req.params.item), 1 );

    User.findByIdAndUpdate(req.params.id, {$set: {toEat: arr}}).then((data) => {
      res.status(200).json(data);
    }
  ).catch((err)=> {res.send("err " + err); });
  }).catch((err) => {res.send(err)});
});


router.route('/add').post((req, res) => {
  console.log("req " + req);
  const username = req.body.username;
  const description = req.body.description;
  const toEat = req.body.toEat;
  const specialties = req.body.specialties;
  const tags = req.body.tags;
  const articles = req.body.articles;
  const reviews = req.body.reviews;
  const requests = req.body.requests;
  const picture = req.body.picture;

  const newUser = new User({
    username,
    description,
    toEat,
    specialties,
    tags,
    articles,
    reviews,
    requests,
    picture,
  });
  console.log("new user " + newUser);
  fs.mkdirSync("../public/" + req.body.username, { recursive: true });

  newUser.save()
    .then(()=>res.json('User added!'))
    .catch(err=>res.status(400).json('Error: ' + err));

});

router.route('/updatespecialties/:author/:tag').post((req, res) => {
  var newSpecialties = [];
  User.findById(req.params.author).then((data) => {
    newSpecialties = data["specialties"];
    if(newSpecialties.includes(req.params.tag))
    {
      res.send("included");
    }
    else {
      newSpecialties.push(req.params.tag);
      User.findByIdAndUpdate(req.params.author, {$set: {specialties : newSpecialties}}).then(()=> {
        res.send(req.params.author + " received an update " + newSpecialties);
      }).catch(err => res.status(400).json("error: " + err));

    }
  }).catch(err => res.send(err));
});

router.route('/updatearticles/:author/:article').post((req, res) => {
  var newArticles = [];
  User.findById(req.params.author).then((data) => {
    newArticles = data["articles"];
    if(newArticles.includes(req.params.article))
    {
      res.send("included");
    }
    else {
      newArticles.push(req.params.article);
      User.findByIdAndUpdate(req.params.author, {$set: {articles : newArticles}}).then(()=> {
        res.send(req.params.author + " received an update " + newArticles);
      }).catch(err => res.status(400).json("error: " + err));

    }
  }).catch(err => res.send(err));
});

router.route('/updateeatlist/:user/:articleID').post((req, res) => {
  var newEatList = [];

  User.findById(req.params.user).then((data) => {
    newEatList = data["toEat"];
    if(newEatList.includes(ObjectId(req.params.articleID)))
    {
      console.log("this is included on eat list");
      res.send("included");
    }
    else {
      console.log("trying something");
      newEatList.push(ObjectId(req.params.articleID));
      User.findByIdAndUpdate(req.params.user, {$set: {toEat : newEatList}}).then(()=> {
        res.send(req.params.user + " received an update " + newEatList);
      }).catch(err => res.status(400).json("error: " + err));

    }
  }).catch(err => res.send(err));

});

router.route('/getidbyusername/:str').get((req,res) => {

  var re = new RegExp("^" + req.params.str + "$", "i");
  User.find({"username":{$regex: re}}).then((data) => {
    if(String(data) === "") {
      console.log("empty");
      res.send("empty");

    }
    else {

      console.log("data[_id] " + data[0]["_id"]);

      res.send(data[0]["_id"]);

    }
  })
});

router.route('/updateuserreviews/:id').post((req, res) => {
  var arr = [];
  User.findById(req.params.id).then((data) => {
    /// to reset
    //arr = [];
    arr = data["reviews"];
    arr.push(req.body.reviewID);
    User.findByIdAndUpdate(req.params.id, {$set: {reviews : arr}}).then(()=> {
      res.send("bravo");
    }).catch(err => res.status(400).json("error: " + err));
  }).catch(err => res.status(400).json("error: " + err));;

});

router.route('/get/:id').delete((req, res) => {
   User.findByIdAndDelete(req.params.id)
     .then(() => res.json('User deleted'))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:id').get((req, res) => {
   User.findById(req.params.id)
     .then((data) => res.json(data))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {

     User.findByIdAndUpdate(
       req.params.id, {$set: {username : req.body.username, description : req.body.description,
         toEat: req.body.toEat, specialties: req.body.specialties,
          tags: req.body.tags, articles: req.body.articles, reviews: req.body.reviews,
          requests: req.body.requests, picture: req.body.picture}})
     .then(() => res.status(200).json("bravo"))
     .catch(err => res.status(400).json('Error6: ' + err));
});

router.route('/updateprofile/:id').post((req,res) => {
  User.findByIdAndUpdate(
    req.params.id, {$set: {username : req.body.username, description : req.body.description,
      tags: req.body.tags, picture: req.body.picture}})
  .then(() => res.status(200).json("bravo"))
  .catch(err => res.status(400).json('Error6: ' + err));
});

router.route('/getidsbyusernamestring/:str').get((req,res) => {
  var re = new RegExp(".*" + req.params.str + ".*" , "i");
  var arr = [];
  User.find({"username":{$regex: re}})
  .then((data) => {
    for(var i in data) {
      arr.push({
       "username" :  data[i]["username"],
       "id" : data[i]["_id"]
      });
    }
    res.send(arr);
  })
  .catch((err) => res.status(400).json("errror: " + err));
});

router.route('/confirmifusernameexists/:str').get((req,res) => {

  var re = new RegExp("^" + req.params.str + "$", "i");
  User.find({"username":{$regex: re}}).then((data) => {
    if(String(data) === "") {
      console.log("empty");
      res.send("empty");

    }
    else {
      console.log("taken");
      res.send("taken");

    }
  })
})



module.exports = router;
