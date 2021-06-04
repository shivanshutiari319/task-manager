const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const userSchema = new Schema({
 name:{
     type:String
 },
 email:{
     type:String,
     unique:true,
     trim:true,
     required:true,
     validate(value){
         if(!validator.isEmail(value)){
             throw new Eroor('email is invalid')
         }
     }
 },
 password:{
     type:String,
     required:true,
     minlength:7
 },age:{
     type:Number,
     default:0,
     validate(age){
         if(age<0)throw new Error('age must be positive')
     }
 },
 tokens:[{
     token:{
         type:String,
         required:true
     }
 }]



});

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})



userSchema.methods.toJSON =  function(){

const user= this
const userobject= user.toObject()

delete userobject.password
delete userobject.tokens
return userobject


}

userSchema.methods.generateauthtoken = async function(){
  const user = this
  const token = jwt.sign({_id:user._id.toString()},'thisismynewcourrse')
  user.tokens = user.tokens.concat({token})
  await user.save()
return token

}
userSchema.statics.findByCredentials = async (email,password)=>{
  
        const user =await User.findOne({email})
        console.log(user);

if(!user){
    // res.send('userdosnt exist')
    throw new Error('Unable to login why login')
}

const ismatch =await bcrypt.compare(password,user.password);
if(!ismatch){
    throw new Error('Unable to login')
}
 return user

    
}


userSchema.pre('save',async function(next){
    const user = this;
if(user.isModified('password')){
    user.password= await bcrypt.hash(user.password,8)
}

next()
})





const User = mongoose.model('User', userSchema);
module.exports=User
