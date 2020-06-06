const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String, required: true},
  description: {type: String, required: true },
  toEat: {type: [ObjectId], required: false }, // IDs of articles
  specialties: {type: [ObjectId], required: false}, // user unable to add to these
  tags: {type: [ObjectId], required: false},
  articles: {type: [ObjectId], required: false},
  reviews: {type: [ObjectId], required: false},
  requests: {type: [ObjectId], required: false},
  picture: {type: String, required: false},

},
  {timestamps: true,});


const User = mongoose.model('User', userSchema);
module.exports = User;
