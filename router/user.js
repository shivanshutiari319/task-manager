const express = require('express')
const router=express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify',false)
const User= require('../model/user');
mongoose.set('useCreateIndex', true);

router.get('/users/me',auth,async(req,res)=>{
   res.send(req.user)
    
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