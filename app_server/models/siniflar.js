const mongoose = require('mongoose');

const sinifSchema = new mongoose.Schema({
    sinifadi:{type:String},
    deneme:{type:String},
    ogretmen: [{
    ders:String,
    ogretmen:String,
    ogretmen_id:String
        }],
  
   
 })

module.exports = mongoose.model('Siniflar', sinifSchema);