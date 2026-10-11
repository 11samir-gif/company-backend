import express from "express"
import dotenv from 'dotenv'
// to read enviroment varaibels
import connectedToDb from "./config/dbConnect.js";
import messageRouter from "./router/messageRouter.js";
import { startConsumer } from "./consumer.js";



dotenv.config()
const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}))
//تفعيل Middleware لقراءة بيانات الـ JSON
//الشرح: نفعّل الـ Middleware المدمج في Express لتحويل نص الـ JSON القادم في جسم الطلبات (Request Body) إلى كائن JavaScript جاهز للاستخدام.
  
app.use("/api/messages",messageRouter)
// use errorHandling
app.use((err,req,res,next)=>{
const statusCode=err.statusCode || 500
const status=err.status||"error"
const message=err.message||"internal Server"
res.status(statusCode).json({
  success: false,
    status,
    message,
    
})
})
async function start() {
    const PORT = process.env.PORT || 3000;
  try {
    // 1. Connect Database
    await connectedToDb();

    // 2. Start Express Web Server
    app.listen(PORT, () => {
      console.log(` Express API running on http://localhost:${PORT}`);
    });

    // 3. Start RabbitMQ Consumer
    await startConsumer();

  } catch (error) {
    console.error(' Server  error:', error.message);
    process.exit(1);
  }
}

start();
