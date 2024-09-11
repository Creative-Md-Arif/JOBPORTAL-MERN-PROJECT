import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User alerady exist with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordmatch = await bcrypt.compare(password, user.password);
    if (!isPasswordmatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account dosen't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userID: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: "Strict",
      })
      .json({
        message: "Welcome back ${user.fullname}",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req , res) => {
    
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        
    }
}


export const updateProfile = async (req , res)=>{
    try {
        const {fullname , email , phoneNumber , bio , skills} = req.body;
        const file = req.file;
        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
            
        };

        // cloudinary ayega idhr

        const skillsArray = skills.split(",");
        const userID = req.id;  //middleware authentication
        let user = await User.findById(userID);

        if (!user) {
            return res.status(400).json({
                message:"User not found",
                success:false
            });
            
        };

        // updating data
        user.fullname = fullname,
        user.email = email,
        user.phoneNumber = phoneNumber,
        user.profile.bio = bio,
        user.profile.skills = skillsArray

        // resume comes later here...

        await user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
          };

          return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
          })
        
    } catch (error) {
        console.log(error);
        
    }
}