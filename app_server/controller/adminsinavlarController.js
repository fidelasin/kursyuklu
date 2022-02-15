var multer  = require('multer');
var fileUpload= require('../middlewares/uploadMiddleware');
var XLSX = require('xlsx')
//const User =require('../models/user');
const SinavModel =require('../models/sinavlar');
const url = require('url');
const { json } = require('body-parser');



module.exports={
    fileUploadForm:function(req,res){
      res.render('admin/sinavlar',{layout: "admin/layout"});
   },
     uploadFile:async function(req,res){
        var upload = multer({
                    storage: fileUpload.files.storage(), 
                    allowedFile:fileUpload.files.allowedFile 
                    }).single('file');
        await upload(req, res,async function (err) {
           if (err instanceof multer.MulterError) {
              res.send(err);
           } else if (err) {
              res.send(err);
           }else{
                      await  dosyaoku(req.body.sinavadi,req.body.sinavtarih);
            console.log(req.body.sinavtarih)

         res.render('admin/sinavlar',{layout: "admin/layout"});
      }
           
        })
        
     }
}


module.exports.sinavlargetir=async function(req,res){
   if(res.locals.session.role !=="admin" && res.locals.session.role !=="personelMd"){
     res.redirect('/');
   }
   else
   {
      await SinavModel.find({},function(err,doc){
         res.json(doc);
       })
    }
 }

 module.exports.sinavsil=async function(req,res){
   if(res.locals.session.role !=="admin"){
     res.redirect('/');
   }
   else
   { 
     await  SinavModel.findByIdAndRemove({_id:req.params._id} ,async (err, doc) => {
       }); 


       await SinavModel.find({},function(err,doc){
         res.json(doc);
       })

   }
 }
 
 async function dosyaoku(sinavadi,sinavtarih){
      
      var workbook = XLSX.readFile('public/files/sinav.xlsx');
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

      var newsave=new SinavModel({sinav:sinavadi,sinavtarih:sinavtarih});
     await newsave.save( function(err,doc){
          if(err)
          {
          console.log("Hata mesajı: "+err);
          }
          else
          {
            console.log(xlData);

              SinavModel.findOneAndUpdate(
               { _id: doc._id }, 
               { $push:{sinavlar:xlData}  },
              function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(success);
                    } 
                }); 
          }
         }) 
        
}


/*
function kayit(odemes){
   
   let tc=odemes["tc"]
   User.findOneAndUpdate(
      { tc: tc }, 
      { $push:{sinavlar:odemes}  },
     function (error, success) {
           if (error) {
               console.log(error);
           } else {
               console.log(success);
           } 
       });

}
*/