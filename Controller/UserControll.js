const Mongodb=require('mongodb');
const mongoClient=Mongodb.MongoClient;
const env=require('dotenv');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
env.config();
const url=process.env.DB;
console.log(url);


const Googleclient = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const UserRegister=async(req,res)=>{
    req.body.user = true;
  try {
    //connect db
    let client = await mongoClient.connect(url);
    //select db
    let db = client.db("job");
    let check = await db.collection("users").findOne({ email: req.body.email });

    if (!check) {
      //Hash password
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);

      req.body.password = hash;
      //post db
      let data = await db.collection("users").insertOne(req.body);
      //close db
      await client.close();
      res.json({
        message: "user registered",
      });
    } else {
      // console.log("mail id already used");
      res.status(409).json({
        message: "Email already Registered",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Registeration failed",
    });
  }
  }
//Register user by google Oauth

const GoogleRegisterByUser = async (req, res) => {
    // console.log("login");
    try {
      const { token } = req.body;
    const ticket = await Googleclient.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
  
    const { given_name,family_name, email, picture,email_verified } = ticket.getPayload();
    if(email_verified){
  //connect db
  let client = await mongoClient.connect(url);
  //select db
  let db = client.db("job");
  let check = await db.collection("users").findOne({ email: email });
  
  if (!check) {
    //post db
    let data = await db.collection("users").insertOne({firstName:given_name,lastName:family_name,email,picture,address:"Kindly add your address by using Edit",admin:false});
    //close db
    await client.close();
    res.json({
      message: "user registered",
    });
  } else {
    // console.log("mail id already used");
    res.status(409).json({
      message: "Email already Registered",
    });
  }
    }
    else{
      res.status(404).json({
        message: "Something went wrong",
      });
    }
  
    } catch (error) {
      console.log(error);
      res.status(404).json({
        message: "Internal server error",
      });
    }
  };
  

//user login
const UserLogin = async (req, res) => {
    // console.log("login");
    try {
      let client = await mongoClient.connect(url);
      let db = client.db("job");
      // console.log(req.body.email);
      let user = await db.collection("users").findOne({ email: req.body.email });
  
      if (user) {
        let matchPassword = bcrypt.compareSync(req.body.password, user.password);
  
        if (matchPassword) {
          let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          // console.log(user.Admin);
          res.json({
            message: true,
            token,
            unconditional: user.admin,
          });
        } else {
          res.status(401).json({
            message: "Username/Password is incorrect",
          });
        }
      } else {
        res.status(401).json({
          message: "Username/Password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        message: "Internal server error",
      });
    }
  };

  //user login by user

  const GoogleLoginbyusers=async(req,res)=>{
    try {
      const { token } = req.body;
      const ticket = await Googleclient.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      // console.log("--------------------------------------");
      // console.log(ticket);
      // console.log("---------------------------------------");
      const { email,email_verified } = ticket.getPayload();
      
      if(email_verified){
        let client = await mongoClient.connect(URL);
      let db = client.db("job");
      // console.log(req.body.email);
      let user = await db.collection("users").findOne({ email: email });
  
      let jwttoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // console.log(user.Admin);
      res.json({
        message: true,
        token:jwttoken,
        unconditional: user.admin,
      });
      }else{
        res.status(404).json({
          message: "Username/Password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        message: "Internal server error",
      });
    }
  }

  module.exports={UserRegister,GoogleRegisterByUser,UserLogin,GoogleLoginbyusers}
