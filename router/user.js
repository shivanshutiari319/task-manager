const express = require('express')
const router=express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const multer = require('multer')
mongoose.set('useFindAndModify',false)
const User= require('../model/user');
mongoose.set('useCreateIndex', true);

router.get('/users/me',auth,async(req,res)=>{
   res.send(req.user)
    
})
const upload = multer({
   
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
  if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('plz upload file'))
}
            cb(undefined,true)
    }
   
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.user.avatar= req.file.buffer
    await req.user.save()

    try {
        res.send();
    } catch (error) {
        res.send(error)
    }
   
},(error,req,res,next)=>{
if(error)res.send({error:error.message})


})

router.get('/users/:id/avatar',async(req,res)=>{

try {
    const user= await User.findById(req.params.id);
    if(!user|| !user.avatar){
        throw new Error()
    }
    res.set('Content-Type','image/jpg')
    res.send(user.avatar)
    
} catch (error) {
    
}


})

router.delete('/users/me/avatar',auth,async(req,res)=>{

req.user.avatar=undefined;
 await req.user.save()
 res.send()


})


router.post('/users/logout',auth,async(req,res)=>{

try {
    req.user.tokens = req.user.tokens.filter((token)=>{
        return token.token!==req.token
    })
   await req.user.save();
   res.send();


} catch (error) {
    res.status(500).send()

    
}

})

router.post('/users/logoutall',auth,async(req,res)=>{
     try {
         req.user.tokens =[];
         req.user.save();
         res.send()
     } catch (error) {
         
     }


})




router.delete('/users/me',auth,  async( req,res)=>{
    try {
await req.user.remove()
        res.send(req.user)
    } catch (error) {
        
        res.send(error);
    }


})

router.post('/users/signup',async(req,res)=>{



})


router.post('/users/login',async(req,res)=>{
    try {
        const user= await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateauthtoken();
        // res.send(user)
        res.send({user,token})
        
    } catch (error) {
        console.log(error)
        res.send(error)
    }






})

router.patch('/users/me',auth,async(req,res)=>{


    const updates =Object.keys(req.body)
    // console.log(updates);
    const allowedUpdates = ['name','email','password','age']
    const isValidoperation = updates.every((update)=>{
       return  allowedUpdates.includes(update)
    })
    if(!isValidoperation){
        return res.status(400).send({error:'invalid updates'})
    }
    try {
    
updates.forEach((update)=>req.user[update]=req.body[update]);


await req.user.save()

res.send(req.user)


     } catch (error) {
         console.log(error)
        res.status(404).send(error);
    }
})



router.post('/users',async(req,res)=>{
    const tp= new User(req.body)
    try {
       const token=await tp.generateauthtoken()

        
        await tp.save();
        res.send({tp,token})
    } catch (error) {
        console.log(error)
        
    }
})

module.exports=router