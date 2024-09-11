import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        requred:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
      type:Number,
      required:true,
    },
    role:{
        type:String,
        enum:['student', 'recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, //URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'company'},
        profilePhoto:{
            type:String,
            default:""
        }
    },
},{timestamps:true});

export const User = mongoose.model('User', userSchema);