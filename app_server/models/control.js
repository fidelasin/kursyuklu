var mongoose =require('mongoose');

var Schema= mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, required:true},
    surname: { type: String, required:true},
    email: String ,
    tc: { type: String, required:true, unique:true } ,
    password: { type: String, required:true},
    telefon:{ type: String, required:true},
    veli: { type: String, required:true},
    role: String,
    taksit: String,
    ucret: String,
    sinif: { type: String, required:true},
    token: String,
    password_link: String,
    durum: Boolean
});

var User=mongoose.model('User',userSchema);
module.exports=User;     