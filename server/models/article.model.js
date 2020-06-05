const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  author: {type:ObjectId, required: true},
  title: {type:String, required: true},
  description: {type: String, required: true },
  ingredients: {type: String, required: true},
  steps: {type: String, required: true},
  video: {type: String, required: false},
  tags: {type: [String], required: false},
  picture: {type: String, required: false},
  peerApprovals: {type: Number, required: false},
  numberOfReviews: {type:Number, required: false},
  averageReview: {type:Number, required: false},

},
  {timestamps: true,});


const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
