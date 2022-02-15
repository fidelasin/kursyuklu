const User =require('../models/user');
const SinavlarModel =require('../models/sinavlar');
const url = require('url');
const addMonths = require('addmonths');
const { json } = require('body-parser');

module.exports.index=function(req,res){

  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
    res.render('admin/index', {layout: "admin/layout"})
  }
}

module.exports.ogrencisinavlar=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
   console.log(req.params.tc)

   
   SinavlarModel.find( {
    $and:[{"sinavlar.tc":req.params.tc}]
  },{},{ }, function(err,user){
    console.log(user)
    res.json(user);
   } );
  
}
}
module.exports.kayitGet=function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
        res.redirect('/');
      }
      else
      {
        res.render('admin/kayit', {layout: "admin/layout"})
      }
    
}

module.exports.kayitPost= function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
     res.redirect('/')}
    else 
    {
  console.log("kayit basliyor")
   if(req.body.name !==""&&req.body.surname!==""&&req.body.tc!==""&&req.body.veli!==""&&req.body.telefon!==""&&req.body.sinif!==""&&req.body.ucret!==""&&req.body.taksit!==""&&req.body.password!=="")
    {
      var ilkodemetarihi= req.body.taksittarih

        if(req.body.ilkodememiktari>0)
          {
            ilkucretim=[{odeme:req.body.ilkodememiktari,odemetarihi:ilkodemetarihi}]
          }
        else
          {
            ilkucretim=[];
          }
        var newUser=new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            tc:req.body.tc,
            veli:req.body.veli,
            telefon:req.body.telefon,
            sinif:req.body.sinif,
            password:req.body.password,
            ucret:req.body.ucret,
            taksit:req.body.taksit,
            ogrencino:req.body.ogrencino,
            durum:true,
            role:"ogrenci",
            odemeler: ilkucretim,
            ilktaksit: ilkodemetarihi,
            yapilanodemeler: ilkucretim,
            ekleyen:res.locals.session.userId
          });
            newUser.save( function(err,userd){
                if(err)
                {
                console.log("Hata mesajı: "+err);
                res.redirect('/admin/kayit');
                }
                else
                {
                  
                  var taksit=req.body.taksit;
                  var ucret=req.body.ucret
                  var ilkodememiktari=req.body.ilkodememiktari
                  var odeme=ucret/taksit;
                  var odemes=[];
                 for(i=0;i<taksit;i++){
                    
                   sonrakiTarihler = addMonths(new Date(ilkodemetarihi), i+1)
                   
                    rakam=(ucret-ilkodememiktari)/taksit
                    rakam= rakam.toFixed(2);

                    odemes.push({ odeme:rakam , odemetarihi:sonrakiTarihler,durum:true });

                    } 
                    User.findOneAndUpdate(
                      { _id: userd._id }, 
                      { $push:{ odemeler:odemes}  },
                     function (error, success) {
                           if (error) {
                               console.log(error);
                           } else {
                               console.log(success);
                           }
                       });

                res.redirect('/admin/kayit')
                }
            });
    }
    else
    {
      res.redirect('/admin/kayit')
    }
    }
  }





  module.exports.ogrenciler=function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
      res.redirect("/")
    }
    else{
      res.render('admin/ogrenciler',{layout: "admin/layout"});
    }
  }

  module.exports.ogrenciListe=function(req,res){ 
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
    {res.redirect('/')}
    else
    { 
 console.log("giris yapti");
      const queryObject = url.parse(req.url,true).query;
      const  start=Number(queryObject.start);
      const length=Number(queryObject.length);
      var draw=queryObject["draw"];
      var searchValue=queryObject["search[value]"];
      var sortGelenAd=Number(queryObject["order[0][column]"]);
      var sortGelenSira=queryObject["order[0][dir]"];
      console.log(queryObject["order[0][dir]"])
        props={ "tc" : sortGelenSira}; 
        if(sortGelenAd){
          if(sortGelenAd == 1){props={ "name" : sortGelenSira}; }
          if(sortGelenAd == 2){props={ "surname" : sortGelenSira}; }
        }
        let countData="0";
		let degerJson={};
		let deger=[];

		degerJson["durum"]=true;

       if(res.locals.session.role =="personelMd"){
		   degerJson["role"]="ogrenci";
	   } 
	   deger.push(degerJson);
	   
	   console.log(deger);
	   
        User.find( {
          $and:deger,
          $or: [{name:{ $regex: '.*' + searchValue + '.*' }},{surname:{ $regex: '.*' + searchValue + '.*' }},{tc:{ $regex: '.*' + searchValue + '.*' }}]
        },{},{ }, function(err, users) {
          countData = users.length;
        });
        
      User.find( {
         $and:deger,
       //  $and:[{durum: true }],
        $or: [{name:{ $regex: '.*' + searchValue + '.*' }},{surname:{ $regex: '.*' + searchValue + '.*' }},{tc:{ $regex: '.*' + searchValue + '.*' }}]
        },{},{ 
          skip: start, 
          limit: length,
          sort:props
        
        }, function(err, users) {
        var userMapBirlestir = [];
        var userMapTek = {};
        sirasi=start;
        users.forEach(function(user) {
          
          sirasi++;
          userMapTek = {};
          userMapTek["_id"] = sirasi;
          userMapTek["name"] = user.name;
          userMapTek["surname"] = user.surname;
          userMapTek["tc"] = user.tc;
          userMapBirlestir.push(userMapTek);
          
        });
      const  userMap = {"draw": draw,
      "recordsTotal": countData,
      "recordsFiltered": countData,"data":userMapBirlestir};
      res.json(userMap);   
    });
    }
  }
  
  
  
  
  module.exports.ogrencigetir=function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
    {
      res.redirect('/')
    }else{
     
      User.findOne({tc:req.params.tc},function(err,user){
		  if(res.locals.session.role == "personelMd"){
			  user["role"]="";
		  }
		  if(res.locals.session.role == "admin" &&  user["role"]==""){
			  user["role"]="yok";
		  }		  

        res.json(user);
       } )
  }
}
  
   
  
  
  module.exports.ogrenciduzenle=function(req,res){
    if(res.locals.session.role !=="admin" )
    {
      res.redirect('/')
    }else{
     



        User.findOneAndUpdate( {
        "tc": req.params.ogrencitc
          }, {
              "$set": {
                "tc": req.body.tc,
                "name": req.body.name,
                "surname": req.body.surname,
                "sinif": req.body.sinif,
                "email": req.body.email,
                "veli": req.body.veli,
                "telefon": req.body.telefon,
                "password": req.body.password,
                "role": req.body.role,
              }
          },
        
       function(err, users) {
        })
  }
}
  


  
module.exports.odemeSil=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
    let durumu=false 
    if(req.params.durumu=="1") durumu=true;

   await User.findOneAndUpdate( {
      "tc": req.params.tc,
      "yapilanodemeler._id": req.params._id
        }, {
            "$set": {
                "yapilanodemeler.$.durum": durumu
            }
        },
      
     function(err, users) {
      })
 await   User.findOne({ "tc": req.params.tc},function(err,user){
        res.json(user);})
      

}
}

module.exports.odemeGir= async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){ 
    res.redirect("/") 
  }else{
    
        await  User.findOneAndUpdate(
         { tc: req.body.ogrencitc }, 
         { $push:{ yapilanodemeler:{ odeme:req.body.miktar , odemetarihi:req.body.taksittarih ,durum:true}}  });
          
         await   User.findOne({tc:req.body.ogrencitc},function(err,user){
          res.json(user);})
  }
}



module.exports.tumGelir= async function(req,res){

 if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect("/") 
  }else{
    User.find( {
      $and:[{durum: true },{role:"ogrenci"}],
     },{},{ }, function(err, users) {
      var userMapBirlestir = [];
      var userMapTek = {};
      let yapilanodemelers=0;
     let ucrets=0;
     users.forEach(function(user) {
      ucrets=ucrets+user.ucret;
            user.yapilanodemeler.forEach(function(user) {
              if(user.durum==true){
                yapilanodemelers= yapilanodemelers+user.odeme;
              } 
              
            })
     });
     kalanodemeler=ucrets-yapilanodemelers;

     userMapTek["yapilanodemeler"] = yapilanodemelers;
     userMapTek["kalanodemeler"] = kalanodemeler;
     userMapTek["ucrets"] = ucrets;

     userMapBirlestir.push(userMapTek);

    //console.log(userMapBirlestir)
   res.json(userMapBirlestir);   
 });
}
}


module.exports.cronborc=async function(req,res){
  User.find( {
    $and:[{durum: true },{role:"ogrenci"}],
   },{},{ }, function(err, users) {
    var userMapBirlestir = [];
    var userMapTek = {};
    
   let ucrets=0;
   users.forEach(function(user) {
      console.log(user.name)
      let yapilanodemelers=0
        user.yapilanodemeler.forEach(function(user) {
            if(user.durum==true){
              yapilanodemelers= yapilanodemelers+user.odeme;
            }
          })
      console.log(yapilanodemelers)
      userMapTek["yapilanodemeler"] = yapilanodemelers;

 

   });
   userMapBirlestir.push(userMapTek);
   res.json(userMapBirlestir);  

   
   });
}


module.exports.buAyGelir= async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect("/") 
  }else{

   

    User.find({
      $and:[{durum: true },{role:"ogrenci"}]},{},{ }, function(err, users) {

        var date = new Date();
        var month = date.getMonth()+1; // returns 0 - 11
        var year = date.getFullYear();
         let start= year +"-"+month+"-01";
         let end=year +"-"+month+"-31";
     
         start=new Date(start).toISOString()
         end=new Date(end).toISOString()

         
      var userMapBirlestir = [];
      var userMapTek = {};
      let yapilanodemelers=0;
      let beklenenodemelers=0;
     users.forEach(function(user) {

      user.yapilanodemeler.forEach(function(user) {
        let odemetarihi=new Date(user.odemetarihi).toISOString()
    
                  if(odemetarihi > start && odemetarihi<end)
                  {
                    if(user.durum==true){
                      yapilanodemelers= yapilanodemelers+user.odeme;
                    }
                  }
                })

       user.odemeler.forEach(function(user) {
           let odemetarihi=new Date(user.odemetarihi).toISOString()
            if(odemetarihi > start && odemetarihi<end)
              {
                beklenenodemelers= beklenenodemelers+user.odeme;
              }
            })
     });
     kalanodemeler=beklenenodemelers-yapilanodemelers;

     userMapTek["yapilanodemeler"] = yapilanodemelers;
     userMapTek["kalanodemeler"] = kalanodemeler;
     userMapTek["ucrets"] = beklenenodemelers;

     userMapBirlestir.push(userMapTek);

   console.log(userMapBirlestir)
   res.json(userMapBirlestir);   
 });
}
}


module.exports.ogrenciSil=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
    console.log("sil calisti")
      User.findOneAndUpdate(
      { tc: req.params.tc }, 
      { "durum":false}, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
      })
       
  }
}

module.exports.chart=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
var datas={"labels":["Plant","Process"],"chartData":["10","1"]}
var userMapBirlestir = {"result":true,"message":null, "data":datas};
    res.json(JSON.stringify(userMapBirlestir))
    console.log(JSON.stringify(userMapBirlestir))

  }
}
  
  module.exports.userchange=function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
      res.redirect('/');
    }
    else
    {
     
          User.findOneAndUpdate({_id:req.params._id}, {"name":req.body.name,"surname":req.body.surname,"email":req.body.email,"password":req.body.password,"role":req.body.role}, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
          })
    }
  }
  
  module.exports.userDelete=function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
      res.redirect('/');
    }
    else
    {
          User.findByIdAndRemove({_id:req.params._id} ,(err, Customer) => {
            if (!err) {
                res.json({ msg: "customer deleted", deleted: Customer });
            } else {
                console.log("Error removing :" + err);
            }
        });
            
    }
  }