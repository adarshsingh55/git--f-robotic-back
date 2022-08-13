const express = require("express");
const router = express.Router();
const content = require("../models/Content");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../midleware/fetchuser");


// 1 get all content (localhost/content/fetchall) of spacific id -----------------------------------------------  
router.get("/fetchall", fetchuser, async (req, res) => {
  try {
    const userContent = await content.find({ user: req.user.id }).sort({date :'desc'});
    res.json(userContent);
  } catch (error) {
    console.log(error);
    res.status(500).send("some erro has occe in fetchall rout");
  }
});

//fetch by generalTag name localhost/content/getbygeneraltag
router.put("/getbygeneraltag", async (req, res) => {
  try {
    const userContent = await content.find({ generalTag: req.body.generalTag }).sort({date :'desc'});
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
    // a. fountion for adding link 
   try{
      
    const errors = validationResult(req);
    if (!errors.isEmpty()) {  
      return res.status(400).json({ errors: errors.array() });
    }

    const {projectName, youtubeLink,description,sanitizedHtml ,tag,generalTag} = req.body;
    // console.log(req.body);
    const Content = new content({
        projectName, youtubeLink ,description ,sanitizedHtml ,tag,generalTag, user: req.user.id,
    })
    await Content.save()
    res.json(Content)
}catch(error){
    console.log(error);
    res.json({Error:"some error has occer in saving the content"})
}
})
// 3 update (localhost/content/updatedata/:id) the content
router.put(
  "/updatedata/:id",
  fetchuser,[
    body("projectName", "enter a valid title").isLength({ min: 3 }), // validating
    body("description", "discription must contain atlist 5 character").isLength({ min: 5 }),
  ],async (req, res) => {
    const { projectName, youtubeLink,description,sanitizedHtml ,tag,generalTag } = req.body;
    try {
    const updated={}; 
    if(projectName){updated.projectName = projectName}
    if(description){updated.description = description}
    if(tag){updated.tag = tag}
    if(youtubeLink){updated.youtubeLink = youtubeLink}
    if(sanitizedHtml){updated.sanitizedHtml = sanitizedHtml}
    if(generalTag){updated.generalTag = generalTag}
  
  // find the data to be update
let data =await content.findById(req.params.id)
  if(!data){ return res.status(400).send('data not found')}
  if(data.user.toString() !== req.user.id){
    return res.status(401).send('not allowed')
  }
  data = await content.findByIdAndUpdate(req.params.id,{$set: updated},{new:true})
  res.json({data})
} catch (error) {
  console.log(error);
  res.status(500).send("some erro has occe in update datas rout");
}
  }
  );

// 4 discard this content (localhost/content/deletedata/:id)

router.delete(
  "/deletedata/:id",
  fetchuser,async (req, res) => {
    try {
  // find the deleteItem to be delete and delete
let deleteItem  =await content.findById(req.params.id)
  if(!deleteItem){return res.status(400).send('data not found')}

  // allow delete only if user own it
  if(deleteItem.user.toString() !== req.user.id){
    return res.status(401).send('not allowed')
  }

  deleteItem  = await content.findByIdAndDelete(req.params.id)
  res.json({"success":"data has been deleted",deleteItem :deleteItem})
} catch (error) {
  console.log(error);
  res.status(500).send("some erro has occe in Deleteing datas rout");
}
  }
  );



// 4 get this content (localhost/content/getData/:id)

router.get(
  "/getdata/:id",
  fetchuser,async (req, res) => {
    try {
  // find the deleteItem to be delete and delete
let getData  =await content.findById(req.params.id)
  if(!getData){return res.status(400).send('data not found')}
  console.log(getData)
  res.json({"success":"take the data ", getData:getData})
} catch (error) {
  console.log(error);
  res.status(500).send("some erro has occe in getdata datas rout");
}
  }
  );
module.exports = router;
