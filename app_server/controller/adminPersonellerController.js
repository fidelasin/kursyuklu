const PersonellerModel =require('../models/personeller');
const Giderler =require('../models/giderler');
const SiniflarModel =require('../models/siniflar');

const url = require('url');
const { json } = require('body-parser');


module.exports.personelget=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
      res.render('admin/personeller',{layout: "admin/layout"});

  }
}

module.exports.personellergetir=async function(req,res){
    if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
      res.redirect('/');
    }
    else 
    {
       await personellistele(res) 
    }
  }
  
 async function personellistele(res){
    await PersonellerModel.find({},function(err,doc){
        res.json(doc);
      })
  }
  module.exports.personeladisil=async function(req,res){
    if(res.locals.session.role !=="admin" ){
      res.redirect('/');
    }
    else
    { 
      PersonellerModel.findByIdAndRemove({_id:req.params._id} ,async (err, Customer) => {
            if (!err) {
                await  personellistele(res)
            } else {
             }
        }); 
    }
  }
  
module.exports.personeladigir=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
    res.redirect('/');
  }
  else
  {
    await PersonellerModel.insertMany({personeladi:req.body.personeladi,personelbrans:req.body.personelbrans},async function(err,doc){
        await personellistele(res)
    })
    
    await Giderler.find({gideradi:req.body.personeladi} ,function(err,doc){
      console.log(doc)
      if(doc.length ==0 ){
   
        Giderler.insertMany({gideradi:req.body.personeladi,tur:"personel"})
      }
    })

  }
} 


  

module.exports.personeldetaygetir=function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
   
    PersonellerModel.findOne({_id:req.params._id},function(err,doc){
      SiniflarModel.find({},function(err,docs){
        res.json({data:doc,sinifdata:docs});
      } )
     } )
}
}

module.exports.personelsinifgir=async function(req,res){
  if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd")
  {
    res.redirect('/')
  }else{
   
await    PersonellerModel.findOneAndUpdate({ _id: req.body.personelid }, 
  { $push:{ siniflar:{ sinifadi:req.body.personelsinif}}  },{new: true});

  await    SiniflarModel.findOneAndUpdate({ sinifadi:req.body.personelsinif }, 
    { $push:{ ogretmen:{ogretmen :req.body.personeladi,ders :req.body.personelbrans,ogretmen_id :req.body.personelid} }  },{new: true},function(err,doc){
     
    });

  await   
    PersonellerModel.findOne({_id: req.body.personelid},function(err,doc){
      SiniflarModel.find({},function(err,docs){
        res.json({data:doc,sinifdata:docs});
      })
     })
 
    }


}