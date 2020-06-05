const router = require('express').Router();
// '5f91aa1f5e3669de4c3a587d76f4f470538c3b9ecf1d24f381f818f6b320eaa6'

let Article = require('../models/article.model');

router.route('/').get((req, res) => {
  Article.find()
    .then(articles => res.json(articles))
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/gettags/:id').get((req, res) => {
  Article.findById(req.params.id)
     .then((data) => res.send(data["tags"]) )
});

router.route('/add').post((req,res) => {

  const author = req.body.author;
  const title = req.body.title;
  const description = req.body.description;
  const ingredients = req.body.ingredients;
  const steps = req.body.steps;
  const video = req.body.video;
  const tags = req.body.tags;
  const picture = req.body.picture;
  const peerApprovals = Number(req.body.peerApprovals);
  const numberOfReviews = Number(req.body.numberOfReviews);
  const reviews = Number(req.body.reviews);

  const newArticle = new Article({
    author,
    title,
    description,
    ingredients,
    steps,
    video,
    tags,
    picture,
    peerApprovals,
    numberOfReviews,
    reviews,
  });
  newArticle.save()
    .then((data) => {

      res.send(data["_id"])})
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:id').get((req, res) => {
  Article.findById(req.params.id)
    .then(article => res.json(article))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:id').delete((req, res) => {
  Article.findByIdAndDelete(req.params.id)
    .then(() => res.json('Article deleted'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/search/author/:arg/:str').get((req, res) => {
  var re = new RegExp(".*" + req.params.str + ".*" , "i");
  var arg = req.params.arg;
  var sortBy = {};
  sortBy[arg] = -1;
  Article.find({"author":{$regex: re}}).sort(sortBy).then((data) =>  res.status(200).json(data)).catch(err => res.send(err));
});

router.route('/search/title/:arg/:str').get((req, res) => {
  var re = new RegExp(".*" + req.params.str + ".*" , "i");
  var arg = req.params.arg;
  var sortBy = {};
  sortBy[arg] = -1;

  Article.find({"title":{$regex: re}}).sort(sortBy).then((data) =>  res.status(200).json(data)).catch(err => res.send(err));
});

router.route('/search/tag/:arg/:str').get((req, res) => {
  //req.params.str
  queryParam['"' + req.params.arg + '"'] = -1;
  var re = new RegExp(".*" +   "567a7b12148"+ ".*" , "i");
  var arg = req.params.arg;
  var sortBy = {};
  sortBy[arg] = -1;

  console.log(arg);

  Article.find({"tags": {$in: [re]}}).sort(sortBy).then((data) =>  res.status(200).json(data)).catch(err => res.send(err));
});



router.route('/getbyauthor/:id').get((req, res) => {
  Article.find({author: req.params.id})
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json("errorhgkhk: " + err));
});

router.route('/gettitlebyauthor/:id').get((req,res) => {
  Article.find({author: req.params.id})
  .then((data) => {
    var arr = [];
    for (var elem in data) {
      arr.push({
        "title" : data[elem]["title"],
        "id" : data[elem]["_id"]
      });
    }
    res.send(arr);
  })
  .catch((err) => res.status(400).json("errorhgkhk: " + err));
});

router.route('/update/:id').post((req, res) => {
  Article.findByIdAndUpdate(
    req.params.id, {$set: {author : req.body.author, title : req.body.title,
      description : req.body.description, ingredients: req.body.ingredients,
       steps: req.body.steps, video: req.body.video, tags: req.body.tags,
       picture: req.body.picture, peerApprovals: req.body.peerApprovals,
       numberOfReviews: req.body.numberOfReviews,
       averageReview: req.body.averageReview}})
  .then(() => res.status(200).json("bravo"))
  .catch(err => res.status(400).json('Error6: ' + err));
});

router.route('/fetchtitle/:id').get((req,res) => {
  Article.findById(req.params.id).then((data) => {
    res.send(data["title"]);
  }).catch(err => res.status(400).json("Error fetching title: " + err ));
});

router.route('/fetchAuthor/:id')
.get((req,res) => {
  Article.findById(req.params.id).then((data) => {
    if(data === null) {
      res.send("Chef");
    }
    else {
      res.send(data["author"]);
    }

  }).catch(err => res.status(400).json("Error fetching title: " + err ));
});

router.route('/getarticleinfobytaganduser/:author/:tag').get((req,res) => {
  var sendable = [];
  console.log("tag " + req.params.tag )
  Article.find( {author: req.params.author, tags: { $in: req.params.tag } }).limit(50).then((data) => {
    for (var elem in data) {
      console.log("got something");
      sendable.push({
        "peercount": data[elem]["peerApprovals"],
        "numberOfReviews": data[elem]["numberOfReviews"],
        "averageReview": data[elem]["averageReview"]
      });
    }

    res.send(sendable);
  }).catch((err) => res.status(400).send("Sorry you made a mistake! " + err));
})

router.route("/updaterate/:id").post((req,res) => {
  var average = 0;
  var reviewcount = 0;
  var peercount = 0;
  var averagepast = 0;
  var newAverage = 0;


  var oldRating = req.body.oldRating;
  var oldApproved = req.body.oldApproved;




  Article.findById(req.params.id).then((data) => {
      //to reset comment these lines out
      average = data["averageReview"];
      peercount = data["peerApprovals"];
      reviewcount = data["numberOfReviews"];
      console.log("1");
      console.log("oldRating " + oldRating );
      console.log(reviewcount - 1);
      averagepast = (average*reviewcount - oldRating)/(reviewcount - 1);
      console.log("2");
      console.log("averagepast " + averagepast);
      newAverage = ((reviewcount-1)*averagepast + req.body.rating)/reviewcount;
      console.log("3");
      if(oldApproved === req.body.approved) {
        // do nothing
        console.log(oldApproved +  " " + req.body.approved);
      }
      else {
        if (oldApproved === false) {
          peercount = peercount + 1;
          console.log(oldApproved +  " " + req.body.approved);
        }
        else {
          peercount = peercount - 1;
          console.log(oldApproved +  " " + req.body.approved);
        }
      }

    Article.findByIdAndUpdate(
      req.params.id, {$set: {peerApprovals : peercount,
        numberOfReviews : reviewcount, averageReview: newAverage}})
    .then(() => {
      res.status(200).json("bravo")
    })
    .catch(err => res.status(400).json('Error6: ' + err));
  });


});

router.route("/rate/:id").post((req, res) => {
  var average = 0;
  var reviewcount = 0;
  var peercount = 0;
  var temp = 0;

  Article.findById(req.params.id).then((data) => {
      // to reset comment these lines out
      average = data["averageReview"];
      peercount = data["peerApprovals"];
      reviewcount = data["numberOfReviews"];




    temp = (average*reviewcount + req.body.rating)/(reviewcount + 1);

    if(req.body.approved === true) {
      peercount = peercount + 1;
    }
    reviewcount = reviewcount + 1;
    average = temp;
    Article.findByIdAndUpdate(
      req.params.id, {$set: {peerApprovals : peercount,
        numberOfReviews : reviewcount, averageReview: average}})
    .then(() => {
      res.status(200).json("bravo")
    } )
    .catch(err => res.status(400).json('Error6: ' + err));
  });


});

router.route('/getbytitle/:title').get((req, res) => {
  var re = new RegExp(".*" + req.params.title + ".*" , "i");

  Article.find({"title":{$regex: re}}).limit(25)
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json("errror: " + err));
});

router.route('/getarraybytitle/:title').get((req, res) => {
  var arr = [];
  var re = new RegExp(".*" + req.params.title + ".*" , "i");
  Article.find({"title":{$regex: re}}).limit(25)
  .then((data) => {
    for(var i in data) {
      arr.push({
       "title" :  data[i]["title"],
       "id" : data[i]["_id"],
       "author" : data[i]["author"]
      });
    }
    res.send(arr);
  })
  .catch((err) => res.status(400).json("errror: " + err));
});

router.route('/getbytag/:tag').get((req, res) => {
  var re = new RegExp(".*" + req.params.tag + ".*" , "i");
  Article.find({"tag":{$regex: re}}).limit(25)
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json("errror: " + err));
});



module.exports = router;
