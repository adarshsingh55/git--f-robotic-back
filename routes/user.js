const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../midleware/fetchuser");
var jwt = require("jsonwebtoken");

const jwt_script = "adarshisagood$oy";

// 1 rout for (/user/signup) creating(C) ,Validation (v) ,bcript (B) and give authanticating (A) token and ensure uniqu email -------------
router.post(
    "/signup",
    [
      body("name", "enter a valid name").isLength({ min: 3 }), // validating
      body("email", "enter a valid email").isEmail(),
      body("password", "possword must be atlist 5 chr").isLength({ min: 5 }),
    ],
    async (req, res) => {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
      }
      try {
        let user = await User.findOne({ email: req.body.email }); //insure a unique email
        if (user) {
          return res.status(400).json({success,
            error: "please enter uniqur value for email this email alredy exit",
          });
        }
        const salt = await bcrypt.genSalt(10); // hach the password
        secPass = await bcrypt.hash(req.body.password, salt);
  
        // creating the user
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        });
        const data = {
          user: {
            id: user.id,
          },
        };
        const authtoken = jwt.sign(data, jwt_script); // giving user a token
        console.log(authtoken);
        // jwt.sign(user)
        //  res.json(user)
          success=true;
          res.json({success, authtoken });
      } catch (error) {
        console.log(error);
        res.status(500).json({success,
          error: "some error has occer",
        });
      }
    }
    );

    // 2 rout for authanticate user (/user/login),Validation (v) ,bcript (B) and give authanticating (A) token and ensure uniqu email -------------
    router.post(
    "/login",
    [body("email", "enter a valid email").isEmail()],
    [body("password", " password canot be blank").exists()],
    async (req, res) => {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({success, error: "please try to login with correct credentials" });
        }
  
        const passwordCamapir = await bcrypt.compare(password, user.password);
  
        if (!passwordCamapir) {
          return res
            .status(400)
            .json({success, error: "please try to login with correct credentials" });
        }
  
        const data = {
          user: {
            id: user.id,
          },
        };
        const authtoken = jwt.sign(data, jwt_script); // giving user a token
        // console.log(authtoken);
        success = true;
        res.json({success, authtoken });
      } catch (error) {
        console.log(error);
        res.status(500).json({success,error:"internal server error erro has occer"});
      }
    }
  );

// 3 -rout get logged in User detatle  (/user/getuser) no login requir -------------
router.get("/getuser", fetchuser, async (req, res) => {
    let success=false
    try {
       let userid = req.user.id;
      let user = await User.findById(userid).select("-password");
      success=true;
      res.json({success,user});
    } catch (error) {
      console.log(error);
      res.status(500).json({success,
        error: "some error has occer",
      });
    }
  });
  

// 3 -rout update logged in User detatle  (/user/update) no login requir -------------
router.put("/updateuser", fetchuser, async (req, res) => {
    let success=false
    const { name,description,sanitizedHtml,password  } = req.body;
    try {
        userid = req.user.id;
        user = await User.findById(userid);
        if (!user) {
          return res
            .status(400)
            .json({success, error: "please try to login with correct credentials" });
        }
  
        let passwordCamapir1 = await bcrypt.compare(password, user.password);
  
        if (!passwordCamapir1) {
          return res
            .status(400)
            .json({success, error: "please try to enter the correct credentials" });
        }


    const updatedUser={}; 
    if(name){updatedUser.name = name}
    if(description){updatedUser.description = description}
    if(sanitizedHtml){updatedUser.sanitizedHtml = sanitizedHtml}

    let userdata = await User.findByIdAndUpdate(userid,{$set: updatedUser},{new:true})
    
      success=true;
      res.json({success,userdata});
    } catch (error) {
      console.log(error);
      res.status(500).json({success,
        error: "some error has occer",
      });
    }
  });
  


module.exports = router;