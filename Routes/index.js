const express=require('express');
const { recruiterRegister, GoogleRegisterByRecruiter, recruiterLogin, GoogleLoginbyrecruiter, postJob, JobByrecruiter, AppliedToPreviousJobs, recruiterForgetpassword, recruiterResetpassword } = require('../Controller/RecruiterControl');
const { UserRegister, GoogleRegisterByUser, UserLogin, GoogleLoginbyusers, Jobsforuser, ApplyJob, ApplyedJob, UserForgetpassword, UserResetpassword } = require('../Controller/UserControll');
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
router.get("/appliedPreviousJob",[authenticate],[Recruitercheck],AppliedToPreviousJobs);
router.get("/Jobsforuser",[authenticate],[UsersCheck],Jobsforuser);
router.get("/AppliedJobsforuser",[authenticate],[UsersCheck],ApplyedJob);
router.post("/applyjob",[authenticate],[UsersCheck],ApplyJob);
router.post("/userforgetpassword",UserForgetpassword);
router.post('/reset/:userId/:token',UserResetpassword);
router.post("/recruiterforgetpassword",recruiterForgetpassword);
router.post('/recruiter/reset/:userId/:token',recruiterResetpassword);

module.exports=router;