import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo connected");
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
};
export default connectDB;
