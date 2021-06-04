const User= require('../model/user')
const jwt = require('jsonwebtoken')


const auth = async(req,res,next)=>{
try {
    
const token = req.header('Authorization').replace('Bearer ','')
const decoded= jwt.verify(token,'thisismynewcourrse')
const user = await User.findOne({_id:decoded._id,'tokens.token':token})
if(!user){
throw new Error()
}
req.user=user
req.token=token
next()
// console.log(token)
} catch (error) {
    res.status(401).send({ error: 'Please authenticate.' })
   

}





}
module.exports= auth