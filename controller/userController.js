import UserModel from "../model/usermodel.js";
import asyncWrapper from "../middleware/async.js"
import {otpGenerator} from "../util/otp.js"
import {UnauthorizedError} from "../error/unauthorizedError.js"
import {BadRequestError,NotfoundError} from "../error/index.js"
import {validationResult} from "express-validator"
import {sendEmail} from "../util/sendEmail.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import Token from "../model/authTokenModel.js"
import dotenv from "dotenv"
//import { isEmpty } from "lodash";
dotenv.config();

export const signUp = asyncWrapper(async (req,res,next) => {
    //validation
    const errors= validationResult(req)
    if(!errors.isEmpty())
    {
        return next (new BadRequestError(errors.array()[0].msg))
    }
    //Checking if email is already in use
    const founduser=await UserModel.findOne({email:req.body.email})
    if(founduser)
    {
 return next (new BadRequestError("Email is already exist"))
    }
    // checking if password match
    if(req.body.password!==req.body.confirmPassword)
    {
return next (new BadRequestError("Password does not match"))
    }
    //harshing the user  password
    const hashedpassword = await bcryptjs.hashSync(req.body.password,10);
    //Generating otp generator
const otp =otpGenerator()
const Expirationdate=new Date ().getTime()+(60*1000*5);
//Recording the user to the database
const newUser= new UserModel({
    Firstname:req.body.Firstname,
    Lastname:req.body.Lastname,
    email:req.body.email,
    password:hashedpassword,
    role:req.body.role,
    otp:otp,
    otpExpires:Expirationdate
});
const savedUser= await newUser.save();
await sendEmail(req.body.email, "Verify your password",`your OTP is ${otp}`)
if(savedUser)
{
    return res.status(201).json({
        message:"User created successfully",
        user:savedUser
    })
}
});
export const ValidateOtp=asyncWrapper(async(req, res, next)=>
{
    //validation
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return next (new BadRequestError(errors.array()[0].msg))
    }
    //checking if given otp is stored in our database
    const FounderUser= await UserModel.findOne({otp:req.body.otp})
    if(!FounderUser)
    {
        next (new UnauthorizedError("Authorization denied"));

    }
    //checking if otp is expired or not
    if(FounderUser.otp.Expirationdate< new Date().getTime())
    {
next(new UnauthorizedError("OTP expired"));
    }
//Update user to 
FounderUser.verified=true;
const saveduser=await FounderUser.save();
if(saveduser)
{
 return res.status(200).json({
    message:"User account verified",
    user:saveduser
 }) 
   
}
});
export const SignIn=asyncWrapper(async(req,res,next)=>
{
    //Validation
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
return next (new BadRequestError(errors.array()[0].msg))
    }
    //find user
    const FounderUser=await UserModel.findOne({email:req.body.email})
    if(!FounderUser)
    {
        return next(new BadRequestError("Invalid Email or Password"))
    };
    // check account verification
    if(FounderUser.verified==false)
    {
        return next (new BadRequestError("Account is not verified"))
    }
    // verify password
    const isPasswordverified=await bcryptjs.compareSync(req.body.password,FounderUser.password)
    if(!isPasswordverified)
    {
        return next(new BadRequestError("Invalid Password"))
    }
    //Generate token 
    const token=jwt.sign({id:FounderUser.id,email:FounderUser.email},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
    res.status(200).json({
        message:"User account verified",
        user:FounderUser,
        token:token
    });
});
export const getAllUsers=asyncWrapper(async(req,res,next)=>
{
    const getUsers= await UserModel.find();
    if(getUsers)
    {
        return res.status(200).json(
            {
                size:getUsers.length,
                getUsers
            }
        )
    }
});
export const ForgotPassword=asyncWrapper(async(req,res,next)=>
{
    //validation
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return next(new BadRequestError(errors.array()[0].msg))

    }
    //find user
    const FoundUser=await UserModel.findOne({email:req.body.email})
    if(!FoundUser)
    {
        return next(new BadRequestError("Invalid Email or Password"))
    }
    //Generate token
    const token=jwt.sign({id:FoundUser.id},process.env.JWT_SECRET_KEY,{expiresIn:"15m"})
    //Recording token to the database
    await Token.create({
        token:token,
        user:FoundUser._id,
        expirationDate: new Date().getTime()+(60*1000*5),
    });
    const link=`https://localhost:8080/reset-password?token=${token} & id=${FoundUser.id}`;
    const emailBody=`click on the link below to reset your password \n\n ${link}`;
    await sendEmail(req.body.email,"Reset Your Password",emailBody);
    res.status(200).json(
        {
           message:"we sent you a reset password link to your email" 
        }
    )
});
export const ResetPassword=asyncWrapper(async(req,res,next)=>
{
    //Validation
    const errors=validationResult(req)
    if(!errors.isEmpty())
    
        {
            return next(new BadRequestError(errors.array()[0].msg));
        }
    // checking if password match
    if(req.body.password!==req.body.confirmPassword)
    {
        return next (new BadRequestError("Password does not match"))
    }
    //verify token
    const decoded= await jwt.verify(req.body.token,process.env.JWT_SECRET_KEY)
    if(!decoded)
    {
        return next(new UnauthorizedError("Invalid Token"))
    }
    //checking if token saved on database
    const recordedToken= await Token.findOne({token:req.body.token})
    if(decoded.id!=req.body.id || recordedToken.user!=req.body.id)
    {
        return next(new UnauthorizedError("Invalid token"))
    }
    // checking if token was expired
    if(new Date(recordedToken.expirationDate).getTime() < new Date().getTime())
    {
        return next(new UnauthorizedError("Token expired"))
    }
    //find user
    const Founderuser= await UserModel.findById(req.body.id)
    if(!Founderuser)
    {
        return next(new NotfoundError("User not found"))
    }
    // Deleting user token
    await Token.findByIdAndDelete(recordedToken._id)
    // hashing password
    const hashedpassword=await bcryptjs.hashSync(req.body.password,10)
    // Updating user password
    Founderuser.password=hashedpassword
    const savedUser=await Founderuser.save()
    if(savedUser)
    {
        return res.status(200).json(
            {
                message:"Password reset successfully",
                user:savedUser
            }
        )
    }

    
})
