
var membersRoute=require('./controlRoute');
var adminRoute=require('./adminRoute');
var homeRoute=require('./homeRoute');

module.exports=function(app){

    app.use('/admin',adminRoute)    
app.use('/control',membersRoute);
app.use('/',homeRoute);

}