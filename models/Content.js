const mongoose =require("mongoose")

 const contentSchema =new mongoose.Schema({
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },
    projectName:{
        type:String,
        required:true
    },
    youtubeLink:{
        type:String
    },
    description:{
        type:String
    },
    generalTag:{
        type:String,
        requires:true
    }, 
    tag:{
        type:String,   
    },
    date:{
        type:Date,    
        default:Date.now
    },
     sanitizedHtml :{
        type:String,
        requires:true
    },
      blogUrl:{
        type:String   
    }  
    
})

module.exports=mongoose.model('content',contentSchema)
