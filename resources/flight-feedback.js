var mongoose = require('mongoose');

var feedback = new mongoose.Schema({
  user_id: String,
  feedbackMessage: String,
  response: String,
  chatStatus: Object, // questions asked and answered 
  receive_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('feedback', feedback);