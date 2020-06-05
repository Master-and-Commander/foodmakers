const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: {type:ObjectId, required: true},
  reviewee: {type:ObjectId, required: true},
  articleId: {type:ObjectId, required: true},
  title: {type:String, required: true},
  description: {type: String, required: true },
  rating: {type: Number, required: false},
  approved: {type: Boolean, required: false},

},
{timestamps: true,});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
