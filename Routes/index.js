const express=require('express');
const { recruiterRegister, GoogleRegisterByRecruiter, recruiterLogin, GoogleLoginbyrecruiter, postJob, JobByrecruiter } = require('../Controller/RecruiterControl');
const { UserRegister, GoogleRegisterByUser, UserLogin, GoogleLoginbyusers, Jobsforuser } = require('../Controller/UserControll');
const authenticate = require('../Middleware/Authenticate');
const Recruitercheck = require('../Middleware/Recruitercheck');
const UsersCheck = require('../Middleware/UsersCheck');


const router=express.Router()
router.post("/userregister",UserRegister);
router.post("/recruiterRegister",recruiterRegister);
router.post("/userregisterbygoogle",GoogleRegisterByUser);
router.post("/recruiterRegisterbygoogle",GoogleRegisterByRecruiter);
router.post("/userLogin",UserLogin);
router.post("/recruiterLogin",recruiterLogin);
router.post("/userLoginbygoogle",GoogleLoginbyusers);
router.post("/recruiterLoginbygoogle", GoogleLoginbyrecruiter);
router.post("/createjob",[authenticate],[Recruitercheck],postJob);
router.get("/JobsByrecruiter",[authenticate],[Recruitercheck],JobByrecruiter);
router.get("/Jobsforuser",[authenticate],[UsersCheck],Jobsforuser);
module.exports=router;