const express=require('express');
const { recruiterRegister, GoogleRegisterByRecruiter, recruiterLogin, GoogleLoginbyrecruiter } = require('../Controller/RecruiterControl');
const { UserRegister, GoogleRegisterByUser, UserLogin, GoogleLoginbyusers } = require('../Controller/UserControll');
const authenticate = require('../Middleware/Usercheck');

const router=express.Router()
router.post("/userregister",UserRegister);
router.post("/recruiterRegister",recruiterRegister);
router.post("/userregisterbygoogle",GoogleRegisterByUser);
router.post("/recruiterRegisterbygoogle",GoogleRegisterByRecruiter);
router.post("/userLogin",UserLogin);
router.post("/recruiterLogin",recruiterLogin);
router.post("/userLoginbygoogle",GoogleLoginbyusers);
router.post("/recruiterLoginbygoogle", GoogleLoginbyrecruiter);

module.exports=router;