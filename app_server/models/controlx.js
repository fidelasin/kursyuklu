const mongoose = require('mongoose');

const odemeSchema = new mongoose.Schema({
 odeme: {
      type: Number,
      trim: true,
      required: true
   },
date: {
      type: Date,
      default: Date.now
   },
// each comment can only relates to one blog, so it's not in array
post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   }
 })

module.exports = mongoose.model('Odeme', odemeSchema);
