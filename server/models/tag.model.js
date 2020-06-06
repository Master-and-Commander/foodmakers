const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {type:String, required: true},
  masterable: {type: Boolean, required: true},
  description: {type: String, required: true },
  total: {type: Number, required: false},

},
  {timestamps: true,});


const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
