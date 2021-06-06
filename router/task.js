const express = require('express')
const router=express.Router()
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Task= require('../model/task');
// const multer=require('multer')
// var upload = multer({ dest: 'images' })
const auth= require('../middleware/auth')
router.get('/task',auth,async(req,res)=>{
const match = {}
const sort = {}
if(req.query.completed){
    match.completed=req.query.completed==='true'
}
if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
}


    try {
      await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks);
    } catch (error) {
        res.send(error) 
    }
  
})

router.get('/task/:id',auth,async(req,res)=>{
    
    try {
        const user=req.params.id;
        const tp=await Task.findOne({_id,owner:req.user._id});
        if(!tp){
            return  res.status(404).send();
        }
        res.send(tp);
    } catch (error) {
        res.send(error)
    }
 
    
   
})

router.patch('/task/:id',auth,async (req,res)=>{

const tp= Object.keys(req.body);
const allowedUpdates= ['description','title'];
const find=await tp.every((update)=>{
    return allowedUpdates.includes(update);
})
if(!find){
    return res.status(400).send({error:'invalid updates'})
}
// return res.send(find);

try {
    const find=await Task.findOne({_id:req.params.id,owner:req.user._id})
    // const find =await Task.findById(req.params.id);
   

    
    if(!find)return res.status(404).send()
    tp.forEach((update)=>find[update]=req.body[update])
    await find.save();


res.send(find);

} catch (error) {
    console.log(error);
    res.status(404).send(error);
}


})

router.delete('/task/:id',auth,async( req,res)=>{
    try {
        const find = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        // const task = await req.user.remove()
if(!find){
    res.send('task is not found')

}
        
    } catch (error) {

        res.send(error);
    }


})

router.post('/task',auth,async (req,res)=>{
    const tp= new Task({
        ...req.body,
        owner:req.user._id
    })

    try {
       

        await tp.save();
        res.send(tp);
        
    } catch (error) {
        console.log(error)
        res.send(error)
        
    }
 
})


module.exports=router