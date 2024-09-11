import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // নাম ফিল্ডটি অবশ্যই থাকতে হবে
      },
      description: {
        type: String,
       
      },
      website: {
        type: String,
      
      },
      location: {
        type: String,
        
      },
      logo: {
        type:String,
      },

      userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      }

}, {timestamps:true});

export const Company = mongoose.model('Company', companySchema);