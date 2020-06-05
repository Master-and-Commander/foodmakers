const router = require('express').Router();
let Request = require('../models/request.model');

router.route('/').get((req, res) => {
   Request.find()
     .then((data) => res.json(data))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const recipient = req.body.recipient;
    const sender = req.body.sender;
    const description = req.body.description;
    const article = req.body.article;

    const newRequest = new Request({
      recipient,
      sender,
      description,
      article
    });

    newRequest.save()
      .then(() => res.json('Request added!'))
      .catch(err => res.status(400).json('Error ' + err));
});

router.route('/get/:id').get((req, res) =>{
   Request.findById(req.params.id)
     .then(request => res.json(request))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getbyrecipient/:id').get((req, res) => {
  var sendable = [];

  Request.find({recipient: req.params.id}).then((data) => {
    for (var elem in data) {

      sendable.push({
        "id" : data[elem]["_id"],
        "sender" : data[elem]["sender"],
        "description" : data[elem]["description"],
        "article" : data[elem]["article"]
      });
    }
    res.send(sendable);

  }).catch(err => {res.status(400).json("Error: " + err)});
});

router.route('/getbysender/:id').get((req, res) => {
  var sendable = [];
  Request.find({sender: req.params.id}).then((data) => {
    for (var elem in data) {

      sendable.push({
        "id" : data[elem]["_id"],
        "recipient" : data[elem]["recipient"],
        "description" : data[elem]["description"],
        "article" : data[elem]["article"]
      });
    }
    res.send(sendable);

  }).catch(err => {res.status(400).json("Error: " + err)});

});

router.route('/get/:id').delete((req, res) => {
   Request.findByIdAndDelete(req.params.id)
     .then(() => res.json('Request deleted'))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:id').get((req, res) =>{
   Request.findById(req.params.id)
     .then(request => res.json(request))
     .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
