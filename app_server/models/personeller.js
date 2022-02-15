const mongoose = require('mongoose');

const sinifSchema = new mongoose.Schema({
    personeladi:{type:String},
    personelbrans:{type:String},
    siniflar: [{
        sinifadi:String,
        }],
  
   
 })

module.exports = mongoose.model('Personeller', sinifSchema);