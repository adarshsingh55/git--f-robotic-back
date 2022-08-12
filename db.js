
const mongoose = require('mongoose');
// const mongoUri="mongodb://localhost:27017/gitrobotic"
const mongoUri="mongodb+srv://vaibhav:a12345d@vaibhav.kbcq1.mongodb.net/gitrobotic?retryWrites=true&w=majority"


const connectToMongo =()=>{ 
    mongoose.connect(mongoUri ,()=>{
        console.log('connnect to mongo successfully');
     })
}
module.exports=connectToMongo