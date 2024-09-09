import mongoose, { model, Schema } from 'mongoose';
const schema=mongoose.Schema
const TokenSchema= new schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    expirationDate:{
   type:Date,
   required:true
    }
    
});
const TokenModel=model("Token",TokenSchema);

export default TokenModel;