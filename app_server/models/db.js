var mongoose =require('mongoose');
mongoose.Promise =require('bluebird');

//var mongoDB="mongodb+srv://fidelasin:ql3Jio43PbTHCY9P@cluster0.pywiz.mongodb.net/kurs?retryWrites=true&w=majority";
var mongoDB="mongodb://127.0.0.1:27017/kurs";

mongoose.connect(mongoDB, { useNewUrlParser: true,useCreateIndex: true
},function(err) {
    if (err) console.log(err);
});   
