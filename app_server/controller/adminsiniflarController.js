const SiniflarModel =require('../models/siniflar');
const url = require('url');
const { json } = require('body-parser');
const SinavlarModel =require('../models/sinavlar');


module.exports.sinifget=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
      res.render('admin/siniflar',{layout: "admin/layout"});

  }
}

module.exports.siniflargetir=async function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
      res.redirect('/');
    }
    else
    {
       await siniflistele(res) 
    }
  }
  
 async function siniflistele(res){
    await SiniflarModel.find({},function(err,doc){
        res.json(doc);
      })
  }
  module.exports.sinifadisil=async function(req,res){
    if(res.locals.session.role !=="admin"){
      res.redirect('/');
    }
    else
    { 
        SiniflarModel.findByIdAndRemove({_id:req.params._id} ,async (err, Customer) => {
            if (!err) {
                await  siniflistele(res)
            } else {
             }
        }); 
    }
  }
  
module.exports.sinifAdigir=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
    await SiniflarModel.insertMany({sinifadi:req.body.sinifadi},async function(err,doc){
        await siniflistele(res)
    })
  }
} 

module.exports.sinifsinavlar=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
   console.log(req.params.sinif)

   
   SinavlarModel.find( {
    $and:[{"sinavlar.sinifSube":req.params.sinif}]
  }, function(err,doc){
    console.log(err)
    /*
    let data=[]
    doc.forEach(function(element1) {
      element1.sinavlar.forEach(function(element) {
      if(element.sinifSube==req.params.sinif)
      {
        console.log(element._id)
        data.push(element)
      }
    });
    });
    */
    res.json(doc);
   } )
  
}
}
