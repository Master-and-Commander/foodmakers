const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var requestSchema = new Schema({
  recipient: {type: ObjectId, required: true},
  article: {type: ObjectId, required: true},
  sender: {type: ObjectId, required: true},
  description: {type: String, required: false},


},
{timestamps:true,});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
