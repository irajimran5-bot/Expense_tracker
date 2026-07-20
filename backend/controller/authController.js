import User from "../models/User.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return resizeBy.status(400).json({success:false,message:"User already registered.",});

        }
        const salt=await bycrypt.genSalt(10);
        const hashPassword=await bycrypt.hash(password,salt);
        const user=await User.create({
            name,email,password:hashPassword,
        });
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
        resizeBy.status(201).json({
            success:true,user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
        });
    }catch(error){
        next(error);
    }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};