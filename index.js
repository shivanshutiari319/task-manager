const express = require('express')
const mongoose = require('mongoose')
const app= express()
const task = require('./router/task');
const user = require('./router/user')
const multer = require('multer')
app.get('/',(req,res)=>{
    res.send('hello world')
})
app.use(express.json());
app.use('/',task);
app.use('/',user);
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
     if(!file.originalname.endsWith(".pdf")){
         throw new Error('file pdf')
     }
     cb(undefined,true)

    }
})
app.post('/upload',upload.single('upload'),(req,res)=>{

    res.send()

})


const port = process.env.PORT||3000;

mongoose.connect('mongodb://shivanshu:trisha@cluster0-shard-00-00.tdefa.mongodb.net:27017,cluster0-shard-00-01.tdefa.mongodb.net:27017,cluster0-shard-00-02.tdefa.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-2o0qu0-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(port,(req,res)=>{
        console.log('listining')
    })

})
.catch((err)=>{
    console.log(err);
})



