
var express=require('express');
var path=require('path');
var app=express();
const session=require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var db=require('./app_server/models/db');
ejsLayouts=require('express-ejs-layouts');
const store=require('store')

app.use(session({
  secret: 'Özel-Anahtar',
  resave: false,
  saveUninitialized: true
  }));

app.use(function(req,res,next){
   res.locals.session = {}; //localstorage session ata
  //res.locals.cookie=req.cookies;//localstorage cookide yaz

      if(typeof(store.get('login')) ==="undefined")  //localstorage kontrol et girmismi maksat tekrar sorgu atmasın
      { 
        if(req.cookies.token){  //token cookie varsa devam
          const User =require('./app_server/models/control');
          const mongoose = require('mongoose');
          const Auth = mongoose.model('User');
        Auth.findOne({token:req.cookies.token}, function (err1, user) {
          if (user) {
            store.set('login', "ok")
            store.set('userId', user._id)
            store.set('role', user.role)
            store.set('name', user.name)
            store.set('surname', user.surname)
            store.set('email', user.email)
            res.locals.session.login="ok";
            res.locals.session.userId = user._id;
            res.locals.session.role = user.role;
            res.locals.session.name = user.name;
            res.locals.session.surname = user.surname;
            res.locals.session.email = user.email;
            
          }  
            
            
          });
        }

        }
        else
        {
          res.locals.session.login=store.get('login');
          res.locals.session.userId = store.get('userId');
          res.locals.session.role = store.get('role');
          res.locals.session.name = store.get('name');
          res.locals.session.surname = store.get('surname');
          res.locals.session.email = store.get('email');
        }


  next();
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/app_server/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ejsLayouts);
app.use('/public',express.static(path.join(__dirname,'public')))


/*

app.use(function(req, res, next) {
    console.log("2: Route: " + JSON.stringify(req.route));
    console.log("2: Path: " + req.originalUrl);
    var urls=req.originalUrl;
    console.log(urls);
    //  require('./app_server/routes/loginRoute')(app,urls,express);
    var routess= require('./app_server/routes/Route')(app,urls,express);
    app.get('/',routess);
    next();
  });
*/ 

require('./app_server/routes/managerRoute')(app);

app.listen(12543);
