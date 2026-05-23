import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const registerUser = async (req, res) => {
    console.log("register api hit");
    try {
         const { Name, Email, Password, city, contact, role, ngo}=req.body;
         const exisitingUser = await User.findOne({Email});
         if (exisitingUser) {
            console.log("duplicate found");
            return res.status(400).json({message:"Email already exists"});
         }
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(Password,salt);
         const user = await User.create({
            Name,
            Email,
            Password: hashedPassword,
            city,
            contact,
            role,
            ngo,
         });
        return res.status(201).json(user);
    } catch (error) {
        console.log("Register error",error);
        return res.status(500).json({message:"Server error"});
    }
};
export const loginUser = async (req, res) => {
    try {
        const {identifier, password} = req.body;
        if(identifier===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(
                {id:"admin" ,role:"admin",email:process.env.ADMIN_EMAIL},
                process.env.JWT_SECRET,
                {expiresIn:"2d"}
            );
            const adminUser={
                _id:"admin",
                Name:"Super Admin",
                Email:"process.env.ADMIN_EMAIL",
                role:"admin"
            };
            return res.json({token,user:adminUser});
        }
        const user = await User.findOne({
            $or: [
                {Email: identifier},
                {Name: identifier}
            ]
        });
        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        if(user.isReported) {
            return res.status(403).json({message:"You are blocked by Admin"});
        }
        const token = jwt.sign(
            {id: user._id, role: user.role},
             process.env.JWT_SECRET,
            {expiresIn: "2d"}
        );
        res.json({ token, user});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};