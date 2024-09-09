import {signUp,SignIn,ValidateOtp,getAllUsers,ForgotPassword,ResetPassword} from "../controller/userController.js";
import{ SignupValidation,signInValidation,ValidateOtpValidation,ForgotPasswordValidation,resetPasswordValidation } from "../util/validation.js"
import express from 'express'
const route=express.Router();
route.post('/signup', SignupValidation,signUp);
route.post('/signin',signInValidation,SignIn)
route.post("/reset",resetPasswordValidation,ResetPassword)
route.get("/listAll",getAllUsers)
route.post("/forgotPassword",ForgotPasswordValidation,ForgotPassword)
route.post("/verify",ValidateOtpValidation,ValidateOtp)
export default route;