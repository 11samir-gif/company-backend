import dotenv from "dotenv";
import mongoose from "mongoose";

const connectedToDb=async ()=>{
   dotenv.config()
try {
   // docker doesn't use localhost
   await mongoose.connect(process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/message-server")
console.log("mongo connected")
} catch (error) {
   console.log("error")
   throw error;
}
}
export default connectedToDb