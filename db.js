
const mongoose = require('mongoose');
const mongoUri="mongodb://localhost:27017/gitrobotic"


const connectToMongo =()=>{ 
    mongoose.connect(mongoUri ,()=>{
        console.log('connnect to mongo successfully'); })
}
module.exports=connectToMongo