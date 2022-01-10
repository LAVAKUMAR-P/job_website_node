const Mongodb = require("mongodb");
const mongoClient = Mongodb.MongoClient;
const env = require("dotenv");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
env.config();
const url = process.env.DB;
console.log(url);

const Googleclient = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const recruiterRegister = async (req, res) => {
  req.body.recruiter = true;
  try {
    //connect db
    let client = await mongoClient.connect(url);
    //select db
    let db = client.db("job");
    let check = await db
      .collection("recruiter")
      .findOne({ email: req.body.email });

    if (!check) {
      //Hash password
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);

      req.body.password = hash;
      //post db
      let data = await db.collection("recruiter").insertOne(req.body);
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
};

//Register by google

const GoogleRegisterByRecruiter = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await Googleclient.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    console.log(ticket);
    const { given_name, family_name, email, picture, email_verified } =
      ticket.getPayload();
    if (email_verified) {
      //connect db
      let client = await mongoClient.connect(url);
      //select db
      let db = client.db("job");
      let check = await db.collection("recruiter").findOne({ email: email });

      if (!check) {
        //post db
        let data = await db.collection("recruiter").insertOne({
          firstName: given_name,
          lastName: family_name,
          email,
          picture,
          recruiter: true,
        });
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
    } else {
      res.status(404).json({
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log("--------------------------------------");
    console.log(error);
    res.status(404).json({
      message: "Internal server error",
    });
  }
};

//recruiter login
const recruiterLogin = async (req, res) => {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("job");
    // console.log(req.body.email);
    let user = await db
      .collection("recruiter")
      .findOne({ email: req.body.email });

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

/*Google Login */

const GoogleLoginbyrecruiter = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await Googleclient.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    // console.log("--------------------------------------");
    // console.log(ticket);
    // console.log("---------------------------------------");
    const { email, email_verified } = ticket.getPayload();

    if (email_verified) {
      let client = await mongoClient.connect(url);
      let db = client.db("job");
      // console.log(req.body.email);
      let user = await db.collection("recruiter").findOne({ email: email });

      let jwttoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // console.log(user.Admin);
      res.json({
        message: true,
        token: jwttoken,
        unconditional: user.admin,
      });
    } else {
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
};

const postJob = async (req, res) => {
  console.log(req.body);
  req.body.data.recruiter_id = req.userid;
  try {
    // connect the database

    let client = await mongoClient.connect(url);

    //select the db
    let db = client.db("job");

    //select the collection and perform the action

    let data = await db.collection("jobs").insertOne(req.body.data);

    //close the connection
    await client.close();

    res.status(200).json({
      message: "job created",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "something went wrong",
    });
  }
};
const JobByrecruiter = async (req, res) => {
  try {
    //conect the database
    let client = await mongoClient.connect(url);

    //select the db
    let db = client.db("job");

    //select connect action and perform action
    let data = await db
      .collection("jobs")
      .find({ recruiter_id: req.userid })
      .toArray();

    //close the connection
    client.close();

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const AppliedToPreviousJobs = async (req, res) => {
  try {
    //conect the database
    let client = await mongoClient.connect(url);

    //select the db
    let db = client.db("job");

    //select connect action and perform action
    let apply = await db
      .collection("apply")
      .find({ recruiter_id: req.userid })
      .toArray();

    let CurrentJob = await db
      .collection("apply")
      .find({ job_id: req.headers.current_id })
      .toArray();

    const Privious = [];
    if (CurrentJob.length > 0) {
      for await (let data of apply) {
        if (data.job_id != req.headers.current_id) {
          let index = 0;
          for await (let user of CurrentJob) {
            if (user.user_id == data.user_id) {
              Privious.push(user);
              CurrentJob.splice(index, 1);
            }
            index++;
          }
        }
      }
    }
    console.log("over all result___________________________________");
    console.log(Privious);

    res.status(200).json(Privious);

    //close the connection
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

module.exports = {
  recruiterRegister,
  GoogleRegisterByRecruiter,
  recruiterLogin,
  GoogleLoginbyrecruiter,
  postJob,
  JobByrecruiter,
  AppliedToPreviousJobs,
};
