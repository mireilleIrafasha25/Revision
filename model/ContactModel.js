import mongoose from 'mongoose';
const schema=mongoose.Schema;
const ContactSchema=new schema(
    {
        name:{
            type: 'string',
            required: true

        },
        email:{
            type:'string',
            required: true,
        },
        phone:{
            type:'string',
            required: true,
        }
    }
);
const contactModel=mongoose.model('Contact',ContactSchema);

export default contactModel;