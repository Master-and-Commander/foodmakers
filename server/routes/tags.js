const router = require('express').Router();
let Tag = require('../models/tag.model');

router.route('/').get((req, res) => {
    Tag.find()
      .then(tags => res.json(tags))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const masterable = Boolean(req.body.name);
  const description = req.body.description;
  const total = Number(req.body.total);

  const newTag = new Tag({
    name,
    masterable,
    description,
    total,
  });

  newTag.save()
    .then(() => res.json("tag added!"))
    .catch(err => res.status(400).json("Error: " + err));

});

router.route('/get/:id').get((req, res) =>{
  Tag.findById(req.params.id)
    .then(tag => res.json(tag))
    .catch(err => res.status(400).json('Error: '  + err));
});

router.route('/get/:id').delete((req, res) => {
   Tag.findByIdAndDelete(req.params.id)
     .then(() => res.json('Tag deleted'))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
   Tag.findById(req.params.id)
   .then(tag => {
     tag.name = req.body.name;
     tag.masterable = Boolean(req.body.masterable);
     tag.description = req.body.description;
     tag.total = Number(req.body.total);

     Tag.save()
     .then(() => res.json('Article updated! '))
     .catch(err => res.status(400).json('Error: ' + err));

   })
   .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getbystring/:tag').get((req, res) => {
  var re = new RegExp(".*" + req.params.tag + ".*" , "i");
  Tag.find({"name":{$regex: re}}).limit(25)
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json("errror: " + err));
});

module.exports = router;
