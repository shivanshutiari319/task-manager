const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const taskSchema = new Schema({
 description:{
     type:String,
     unique:true

 },
 title:{
     type:String

     
 },
 owner:{
     type:mongoose.Schema.Types.ObjectId,
     required:true,
     ref:'user'
 }

});


const Task = mongoose.model('task', taskSchema);
module.exports=Task

