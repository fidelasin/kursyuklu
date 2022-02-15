var express=require('express');
var router=express.Router();

var ctrlOgrenci=require('../controller/adminOgrenciController');
var ctrlGider=require('../controller/adminGiderController');
const ctrlSinavlar= require('../controller/adminsinavlarController');
const ctrlSiniflar= require('../controller/adminsiniflarController');
const ctrlPersoneller= require('../controller/adminPersonellerController');

router.get('/',ctrlOgrenci.index);

router.get("/kayit",ctrlOgrenci.kayitGet)
router.post("/kayit",ctrlOgrenci.kayitPost)

router.get('/ogrenciler',ctrlOgrenci.ogrenciler)
router.get('/ogrenciliste',ctrlOgrenci.ogrenciListe)
router.get('/ogrencigetir/:tc',ctrlOgrenci.ogrencigetir)
router.get('/ogrencisinavlar/:tc',ctrlOgrenci.ogrencisinavlar)

router.post("/ogrenciduzenle/:ogrencitc",ctrlOgrenci.ogrenciduzenle)



router.get('/chart',ctrlOgrenci.chart)

router.get('/ogrencisil/:tc',ctrlOgrenci.ogrenciSil)

router.get('/odemesil/:tc/:_id/:durumu',ctrlOgrenci.odemeSil)
router.post('/odemegir',ctrlOgrenci.odemeGir)
router.get('/tumgelir',ctrlOgrenci.tumGelir)
router.get('/buaygelir',ctrlOgrenci.buAyGelir)
router.get('/cronborc',ctrlOgrenci.cronborc)

router.get('/giderkalemlerigetir',ctrlGider.giderKalemleriGetir)
router.get('/giderkalemleri',ctrlGider.giderKalemleri)
router.post('/giderkalemigir',ctrlGider.giderKalemiGir)
router.get('/giderkalemisil/:_id/:durumu',ctrlGider.giderKalemiSil)
router.get('/giderkalemleridetaygetir/:_id',ctrlGider.giderKalemleriDetayGetir)
router.post('/gidergir',ctrlGider.giderGir)
router.get('/gidersil/:_id/:durumu',ctrlGider.giderSil)

router.get('/sinavlargetir',ctrlSinavlar.sinavlargetir)
router.get('/sinavlar',ctrlSinavlar.fileUploadForm)
router.post('/sinavlar',ctrlSinavlar.uploadFile);
router.get('/sinavsil/:_id',ctrlSinavlar.sinavsil)





router.get('/siniflar',ctrlSiniflar.sinifget)
router.get('/siniflargetir',ctrlSiniflar.siniflargetir)
router.get('/sinifadisil/:_id',ctrlSiniflar.sinifadisil)
router.post('/sinifadigir',ctrlSiniflar.sinifAdigir);
router.get('/sinifsinavlar/:sinif',ctrlSiniflar.sinifsinavlar)


router.get('/personeller',ctrlPersoneller.personelget)
router.get('/personellergetir',ctrlPersoneller.personellergetir)
router.get('/personeladisil/:_id',ctrlPersoneller.personeladisil)
router.post('/personeladigir',ctrlPersoneller.personeladigir);
router.get('/personeldetaygetir/:_id',ctrlPersoneller.personeldetaygetir)
router.post('/personelsinifgir',ctrlPersoneller.personelsinifgir);



module.exports=router;