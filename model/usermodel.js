import mongoose from "mongoose";
import { type } from "os";
const schema=mongoose.Schema

const userSchema=new schema({
    Firstname:{
        type:String,
        required:true,
        message:["Please enter your first name"]
    },
    Lastname:{
        type:String,
        required:true,
        message:["Please enter your last name"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
},
    password:{
        type:String,
        required:true,
        message:["Please enter your password"]
    },
    confirmPassword:{
        type:String,
        required:true,
        message:["Please enter your Confirmpassword"]
    },
    role:{
        type:String,
        default:"user",
        enum:{
            values:["user","admin"],
            message:"Role should be either 'user' or 'admin'"
        }
    },
    otp:{
        type:Number,
        required:false,
    },
    otpExpires:{
        type:Date,
        required:false,
    },
    verified:{
        type:Boolean,
        default:false,
        required:true,
    }

});
const UserModel=mongoose.model("User",userSchema)
export default UserModel;