const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const taskSchema = new Schema({
 description:{
     type:String,
     unique:true

 },
 completed:{
     type:Boolean

     
 },
 owner:{
     type:mongoose.Schema.Types.ObjectId,
     required:true,
     ref:'user'
 }

},
{
    timestamps:true

});





const Task = mongoose.model('task', taskSchema);
module.exports=Task

