import connectedToDb from "./config/dbConnect.js";
import dotenv from'dotenv'
import amqp from'amqplib'
import redis from "./redis/redis.js";
import Message from  "./model/messageSchema.js";

dotenv.config()
export const startConsumer=async()=>{
    // connect to db
    let connection;
   try {
     await connectedToDb()
// connect to rabbitmq
  const rabbitUrl=process.env.RABBITMQ_URL || 'amqp://localhost:5672'
 connection= await amqp.connect(rabbitUrl)
  // create channel to save connection
  const channel= await connection.createChannel()
  const queue="messages"
  // check if queue is xists or no
  // use await with check
 await channel.assertQueue(queue,{durable:true})
  // fetch one message 
  channel.prefetch(1)
  console.log(`[*] Consumer is waiting for messages in '${queue}'...`)

  // start to consume message
  channel.consume(queue,async(msg)=>{
    if(msg===null) return;
    try {
        // check is exists un redis or no
        // msgs that came from rabbit تكون ع شكل buffer => bits  // i should turn it into string or jsonString
        const content=JSON.parse(msg.content.toString())
        const messageId=msg.properties.messageId || content.messageId || content.id
        const sender = content.sender;
        const messageText = content.message;
        if (!messageId || !sender || !messageText) {
            channel.nack(msg, false, false);
            return;
        }
        const isExists=await redis.get(`exists:${messageId}`)
        console.log(isExists === true);
        if(isExists) {
            channel.ack(msg)
            return;
        }
        // if not is exists and stored in mongo
        const newMessage=await Message.create({
            messageId:messageId,
            sender:content.sender,
            message:content.message
        })
console.log("mongo saved ", newMessage)
// create this msg in redis
await redis.set(`message:${messageId}`,JSON.stringify(newMessage),"EX",3600)
// i don't undertand this yet
await redis.set(`exists:${messageId}`,true,"EX",86400)
console.log("saved in redis")
// ack after i stored in redis
channel.ack(msg)

    } catch (error) {
        console.log(error.message)
        console.log("error.message")
        channel.nack(msg,false,false)
    }
  },{
        noAck:false
    }),
    connection.on('close', () => {
      console.error('RabbitMQ connection closed.');
   })
   } catch (error) {
    console.log(error.message)
    connection.on('close', () => {
      console.error('RabbitMQ connection closed.');
   })
}


}