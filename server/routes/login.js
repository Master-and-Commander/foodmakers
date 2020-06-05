const router = require('express').Router();

let LoginData = require('../models/logininfo.model');

router.route('/').get((req, res) => {
  LoginData.find()
  .then(logindata => res.json(logindata))
  .catch(err => res.status(400).json('Error4: ' + err));
});


router.route('/add').post((req, res) => {
  const username = req.body.username;
  const email= req.body.email;
  const passwordHash = req.body.passwordHash;
  const usernameID = req.body.usernameID;

  const newLoginData = new LoginData({
    username,
    email,
    passwordHash,
    usernameID,
  });

  newLoginData.save()
  .then(() => res.json("User login data added"))
  .catch(err => res.status(400).json("Error3: " + err));
});


router.route("/validatelogin/").post((req, res) => {
  LoginData.find({
    username: req.body.userName,
    passwordHash: req.body.check}).limit(1).
  then(logindata => {
    if(logindata.toString() === "")
      res.status(400).json("no match")
    else {
      res.status(200).json(logindata)
    }
  }).
  catch(err => res.status(400).json("Something went wrong: " + err) );
});


router.route('/get/:id').get((req, res) => {
  LoginData.findById(req.params.id)
  .then(logindata => res.json(logindata))
  .catch(err => res.status(400).json('Error2: '  + err));
});

router.route('/get/:id').delete((req,res) => {
  LoginData.findByIdAndDelete(req.params.id)
  .then(() => res.json('user deleted'))
  .catch(err => res.status(400).json('Error1: ' + err));
});

router.route('/hashbyusername/:username').get((req,res) => {
  LoginData.find({username: req.params.username}, {passwordHash:1}).limit(1)
  .then(logindata => res.json(logindata))
  .catch(err => res.status(400).json('You messed up here: ' + err));

});

router.route('/findbyemail/:email').get((req,res) => {
  var re = new RegExp("^" + req.params.email + "$","i");
  LoginData.find({"email" : {$regex: re}}).then((data) => {
    if (String(data) === "") {
      res.send("empty");
    }
    else {
      res.send("taken");
    }
  });
});

router.route('/update/:id').post((req, res) => {
  LoginData.findByIdAndUpdate(
    req.params.id, {$set: {usernameID : req.body.usernameID, username : req.body.username, email : req.body.email}})
  .then(() => res.status(200).json("bravo"))
  .catch(err => res.status(400).json('Error6: ' + err));

});

module.exports = router;
