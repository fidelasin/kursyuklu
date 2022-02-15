const Giderler =require('../models/giderler');
const url = require('url');
const addMonths = require('addmonths');
const { json } = require('body-parser');


module.exports.giderKalemleri=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
      res.render('admin/giderkalemleri',{layout: "admin/layout"});

  }
}



module.exports.giderKalemleriGetir=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
    if(res.locals.session.role =="personelMd") {
    await Giderler.find({'tur': {$ne : "personel"}},function(err,docss){

      let gidertum= giderHesaplaTumTamami(docss);
      let gideray= giderHesaplaTumAy(docss);
      res.json({"gidertutartumAy":gideray,"gidertutartumTamami":gidertum,"data":docss});
    })
    }
    if(res.locals.session.role =="admin") {
      await Giderler.find({},function(err,docss){
  
        let gidertum= giderHesaplaTumTamami(docss);
        let gideray= giderHesaplaTumAy(docss);
        res.json({"gidertutartumAy":gideray,"gidertutartumTamami":gidertum,"data":docss});
      })
      }
  }
} 

module.exports.giderKalemiGir=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {

   await Giderler.insertMany({gideradi:req.body.giderkalemi,durum:true},function(err,doc){})

   if(res.locals.session.role =="personelMd") {
    await Giderler.find({'tur': {$ne : "personel"}},function(err,docss){

      let gidertum= giderHesaplaTumTamami(docss);
      let gideray= giderHesaplaTumAy(docss);
      res.json({"gidertutartumAy":gideray,"gidertutartumTamami":gidertum,"data":docss});
    })
    }
    if(res.locals.session.role =="admin") {
      await Giderler.find({},function(err,docss){
  
        let gidertum= giderHesaplaTumTamami(docss);
        let gideray= giderHesaplaTumAy(docss);
        res.json({"gidertutartumAy":gideray,"gidertutartumTamami":gidertum,"data":docss});
      })
      }
  }
}


module.exports.giderKalemiSil=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
    let durumu=false 
    if(req.params.durumu=="1") durumu=true;

   await Giderler.findOneAndUpdate( {"_id": req.params._id}, {
            "$set": {
                "durum": durumu
            }
        })
        if(res.locals.session.role =="personelMd") {
          await Giderler.find({'tur': {$ne : "personel"}},function(err,docss){
      
            let gidertum= giderHesaplaTumTamami(docss);
            let gideray= giderHesaplaTumAy(docss);
            res.json({"gidertutartumAy":gideray,"gidertutartumTamami":gidertum,"data":docss});
          })
          }
          if(res.locals.session.role =="admin") {
            await Giderler.find({},function(err,docss){
        
              let gidertum= giderHesaplaTumTamami(docss);
              let gideray= giderHesaplaTumAy(docss);
              res.json({"gidertutartumAy":gideray,"gidertutartumTamami":gidertum,"data":docss});
            })
            }
         
 
}  
}
 
 

module.exports.giderKalemleriDetayGetir=function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
    {
      res.redirect('/')
    }else{
     
      Giderler.findOne({_id:req.params._id},function(err,doc){
        let gidertum= giderHesaplaTum(doc);
        let gideray= giderHesaplaAy(doc);
        res.json({"gidertutaray":gideray,"gidertutartum":gidertum,"data":doc});
       } )
  }
}
 
module.exports.giderGir=async function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
    {
      res.redirect('/')
    }else{
      await    Giderler.findOneAndUpdate({ _id: req.body._id }, 
            { $push:{ giderler:{ gider:req.body.gider , tarih:req.body.tarih , aciklama:req.body.aciklama ,durum:true}}  },{upsert:true});
             
      await   Giderler.findOne({ _id: req.body._id },function(err,doc){
        let gidertum= giderHesaplaTum(doc);
        let gideray= giderHesaplaAy(doc);
        res.json({"gidertutaray":gideray,"gidertutartum":gidertum,"data":doc});   
      
      })
        }
}


module.exports.giderSil=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
    let durumu=false 
    if(req.params.durumu=="1") durumu=true;

   await Giderler.findOneAndUpdate( {
       "giderler._id": req.params._id
          }, {
            "$set": {
                "giderler.$.durum": durumu
            }
        },
      
     function(err, doc) {
      })
 await   Giderler.findOne({ "giderler._id": req.params._id},function(err,doc){
  let gidertum= giderHesaplaTum(doc);
  let gideray= giderHesaplaAy(doc);
  res.json({"gidertutaray":gideray,"gidertutartum":gidertum,"data":doc});

})
      

}
}







function giderHesaplaTumAy(docss){
  let gider=0;
      docss.forEach(function(docs){
        if(docs.durum==true)
        {

            docs.giderler.forEach(function(doc){
              if(doc.durum==true)
              {
                var giderDate = new Date(doc.tarih);
              var monthGider = giderDate.getUTCMonth() + 1; //months from 1-12
              var yearGider = giderDate.getUTCFullYear();

              var Bugun = new Date();
              var monthBugun = Bugun.getUTCMonth() + 1; //months from 1-12
              var yearBugun = Bugun.getUTCFullYear();
                if(monthGider==monthBugun && yearGider==yearBugun)
                {gider=gider+doc.gider}  

            }
          
            })
        }
        
      })
      return gider
}


function giderHesaplaTumTamami(docss){
  let gider=0;
      docss.forEach(function(docs){
        if(docs.durum==true)
        {

            docs.giderler.forEach(function(doc){
              if(doc.durum==true)
              {
              gider=gider+doc.gider
              console.log(gider)
            }
          
            })
        }
        
      })
      return gider
}

function giderHesaplaTum(doc){
  let gider=0;

  doc.giderler.forEach(function(doc){
      if(doc.durum==true)
      {

          gider=gider+doc.gider
      }
       
    })
      return gider
}


function giderHesaplaAy(doc){
  let gider=0;

  doc.giderler.forEach(function(doc){
      if(doc.durum==true)
      {
        var giderDate = new Date(doc.tarih);
        var monthGider = giderDate.getUTCMonth() + 1; //months from 1-12
        var yearGider = giderDate.getUTCFullYear();

        var Bugun = new Date();
        var monthBugun = Bugun.getUTCMonth() + 1; //months from 1-12
        var yearBugun = Bugun.getUTCFullYear();
          if(monthGider==monthBugun && yearGider==yearBugun)
          {gider=gider+doc.gider}  
      }
      
    })
      return gider
}


