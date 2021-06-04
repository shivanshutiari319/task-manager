const express = require('express')
const mongoose = require('mongoose')
const app= express()
const task = require('./router/task');
const user = require('./router/user')
app.get('/',(req,res)=>{
    res.send('hello world')
})
app.use(express.json());
app.use('/',task);
app.use('/',user);
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




