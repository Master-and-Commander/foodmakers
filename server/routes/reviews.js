const router = require('express').Router();
let Review = require('../models/review.model');


router.route('/').get((req, res) => {
   Review.find()
     .then((data) => res.json(data))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/search/reviewer/:arg/:str').get((req, res) => {
  var arg = req.params.arg;
  var sortBy = {};
  sortBy[arg] = -1;
  Review.find({"reviewer":req.params.str}).sort(sortBy).then((data) =>  res.status(200).json(data)).catch(err => res.send(err));
});

router.route('/search/reviewee/:arg/:str').get((req, res) => {
  var re = new RegExp(".*" + req.params.str + ".*" , "i");
  var arg = req.params.arg;
  var sortBy = {};
  sortBy[arg] = -1;

  Review.find({"reviewee": req.params.str}).sort(sortBy).then((data) =>  res.status(200).json(data)).catch(err => res.send(err));
});





router.route('/add').post((req, res) => {
    const articleId = req.body.articleId;
    const reviewer = req.body.reviewer;
    const reviewee = req.body.reviewee;
    const title = req.body.title;
    const description = req.body.description;
    const rating = req.body.rating;
    const approved = Boolean(req.body.approved);

    const newReview = new Review({
      articleId,
      reviewer,
      reviewee,
      title,
      description,
      rating,
      approved,
    });

    newReview.save()
      .then(() => res.json('Review added!'))
      .catch(err => res.status(400).json('Error ' + err));
});


router.route('/get/:id').get((req, res) =>{
   Review.findById(req.params.id)
     .then(review => res.json(review))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getbyreviewer/:id/:id2').get((req, res) => {

  Review.find({reviewer:req.params.id}).then((data) => {
    var sendable =[];

    for (var elem in data) {
      p1 = String(req.params.id2);
      p2 = String(data[elem]["articleId"]);
      if(p1 === p2)
      sendable.push(data[elem]["_id"]);
    }

    res.send(sendable);
  }).catch(err => {res.status(400).json("Error: " + err)});
});

router.route('/findbyarticleid/:id').get((req, res) => {
  Review.find({articleId: req.params.id})
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json("Error: " + err));
});



router.route('/get/:id').delete((req, res) => {
   Review.findByIdAndDelete(req.params.id)
     .then(() => res.json('Review deleted'))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Review.findByIdAndUpdate(
    req.params.id, {$set: {articleId : req.body.articleId, description : req.body.description,
      description : req.body.description, ingredients: req.body.ingredients,
       rating: req.body.rating, approved: req.body.approved}})
  .then(() => res.status(200).json("bravo"))
  .catch(err => res.status(400).json('Error6: ' + err));
});



module.exports = router;
