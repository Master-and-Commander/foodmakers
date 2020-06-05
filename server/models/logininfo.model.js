const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const logininfoSchema = new Schema(
{
  username: {type:String, required: true},
  email: {type:String, required: false},
  passwordHash: {type:String, required: true},
  usernameID: {type:[ObjectId], required: true}
},
{timestamps: true,});




const LoginData = mongoose.model('LoginData', logininfoSchema);

module.exports = LoginData;
