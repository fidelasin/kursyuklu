const mongoose = require('mongoose');

const odemeSchema = new mongoose.Schema({
   giderkalemi:{type:String,require:true},
   gideradi:{type:String,require:true},
   tur:{type:String},
   durum:Boolean,
   giderler: [{
    durum:Boolean,
    gider:Number,
    aciklama:{type:String,require:true},
   tarih:Date}],
   
 })

module.exports = mongoose.model('Giderler', odemeSchema);