const express = require("express");
const router = express.Router();
// import fetch from "node-fetch"
const content = require("../models/Content");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../midleware/fetchuser");
// const getBlogUrl = require("../midleware/getBolgUrl");
const request =require("request")


// 1 get all content (localhost/content/fetchall) of spacific id -----------------------------------------------  
router.get("/fetchall", fetchuser, async (req, res) => {
  try {
    const userContent = await content.find({ user: req.user.id },{_id:1,projectName:1,description:1,tag:1,date:1}).sort({date :'desc'});
    res.json(userContent);
    // res.json({_id:userContent._id,projectName:userContent.projectName,description:userContent.description});
  } catch (error) {
    console.log(error);
    res.status(500).send("some erro has occe in fetchall rout");
  }
});

//fetch by generalTag name localhost/content/getbygeneraltag
router.put("/getbygeneraltag", async (req, res) => {
  try {
    const userContent = await content.find({ generalTag: req.body.generalTag },{_id:1,projectName:1,description:1,tag:1,date:1}).sort({date :'desc'});
    const tag = await content.find({ generalTag: req.body.generalTag }).distinct("tag");

    res.json({userContent,tag});
  } catch (error) {
    console.log(error);
    res.status(500).send("some erro has occe in fetchall rout");
  }
});  

// fetch by tag name localhost/content/getbytag
router.put("/getbytag", async (req, res) => {
  try {
    const userContent = await content.find({ tag:req.body.tag },{_id:1,projectName:1,description:1,tag:1,date:1}).sort({date :'desc'});
    res.json(userContent);
  } catch (error) {
    console.log(error);
    res.status(500).send("some erro has occe in fetchall rout");
  }
});  

    
// 2 post in "localhost/content/postdata"the content----------------
router.post("/postdata",fetchuser,[
    body("projectName", "enter a valid title").isLength({ min: 3 }), // validating
    body("description", "discription must contain atlist 5 character").isLength({ min: 5 }),
  ],async(req,res)=>{
    let success = false;
    // a. fountion for adding link 
   try{
      
    const errors = validationResult(req);
    if (!errors.isEmpty()) {  
      return res.status(400).json({ errors: errors.array() });
    }
    const {projectName, youtubeLink,description,sanitizedHtml ,tag,generalTag,blogID,bloggerID} = req.body;
    if (blogID) {
      apikey="AIzaSyAXC2h3OKTH67nkKcY3VWQfU3zb5BF9bv8"
      urlBlog=`https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts/${blogID}?key=${apikey}`
      const Content = new content({
        projectName, youtubeLink ,description ,sanitizedHtml ,tag,generalTag, user: req.user.id,blogUrl:urlBlog
        })
        let responce = await Content.save()
        // console.log(Content);
        id =responce._id
         success=true
         res.json({success,id})
    }else
    {
      // console.log("else is run");
    const Content = new content({
      projectName, youtubeLink ,description ,sanitizedHtml ,tag,generalTag, user: req.user.id
    })
    let responce = await Content.save()
    // console.log(Content);
    id =responce._id
     success=true
     res.json({success,id})
  }

}catch(error){
    console.log(error);
    res.json({success,Error:"some error has occer in saving the content"})
}
})
// 3 update (localhost/content/updatedata/:id) the content
router.put(
  "/updatedata/:id",
  fetchuser,[
    body("projectName", "enter a valid title").isLength({ min: 3 }), // validating
    body("description", "discription must contain atlist 5 character").isLength({ min: 5 }),
  ],async (req, res) => {
    let success = false;
    const { projectName, youtubeLink,description,sanitizedHtml ,tag,generalTag,blogID,bloggerID } = req.body;
    try {
    const updated={}; 
    if(projectName){updated.projectName = projectName}
    if(description){updated.description = description}
    if(tag){updated.tag = tag}
    if(youtubeLink){updated.youtubeLink = youtubeLink}
    if(sanitizedHtml){updated.sanitizedHtml = sanitizedHtml}
    if(generalTag){updated.generalTag = generalTag}
    if(blogID){updated.blogID=blogID}
    if(bloggerID){updated.bloggerID=bloggerID}
  
  // find the data to be update
let data =await content.findById(req.params.id)
  if(!data){ return res.status(400).send('data not found')}
  if(data.user.toString() !== req.user.id){
    return res.status(401).send('not allowed')
  }
  data = await content.findByIdAndUpdate(req.params.id,{$set: updated},{new:true})
  success=true
  res.json({success})
} catch (error) {
  console.log(error);
  res.status(500).json({success,Error:"some erro has occe in update datas rout"});
}
  }
  );

// 4 discard this content (localhost/content/deletedata/:id)

router.delete(
  "/deletedata/:id",
  fetchuser,async (req, res) => {
    let success = false;
    try {
  // find the deleteItem to be delete and delete
let deleteItem  =await content.findById(req.params.id)
  if(!deleteItem){return res.status(400).send('data not found')}

  // allow delete only if user own it
  if(deleteItem.user.toString() !== req.user.id){
    return res.status(401).send('not allowed')
  }

  deleteItem  = await content.findByIdAndDelete(req.params.id)
  success=true
  res.json({success})
} catch (error) {
  console.log(error);
  res.status(500).json({success,Error:"some erro has occe in Deleteing datas rout"});
}
  }
  );



// 4 get this content (localhost/content/getData/:id)

router.get(
  "/getdata/:id",
  async (req, res) => {
    let success = false;
    try {
  // find the deleteItem to be delete and delete
let getData  =await content.findById(req.params.id)


  if(!getData){return res.status(400).send('data not found')}
  console.log(getData)

  if (getData.blogUrl) {
    const { blogUrl} = getData
      //  apikey="AIzaSyAXC2h3OKTH67nkKcY3VWQfU3zb5BF9bv8"
      const Rurl = blogUrl
      // console.log(Rurl);
      await request({url:Rurl,json:true},(err,responce,body)=>{
        // console.log(body);
        const content=body.content
        // console.log(content);
        // console.log(content);
        const {user,projectName,youtubeLink,description,generalTag,tag,blogID,bloggerID,_id,date}=getData
        success=true
        return res.json({success, getData:{user,projectName,youtubeLink,description,generalTag,tag,blogID,bloggerID,sanitizedHtml:content,_id,date}})
      })
  }else{
  success=true
  res.json({success, getData:getData})
  }
} catch (error) {
  console.log(error);
  res.status(500).json({success,Error:"some erro has occe in getdata datas rout"});
}
  }
  );
module.exports = router;
