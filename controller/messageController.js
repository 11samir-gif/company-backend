import messageSchema from "../model/messageSchema.js";
import redis from "../redis/redis.js";
import errorHandling from "./errorController.js";
// logic for apis
// 1. جلب الرسالة بواسطة messageId
export const getMessageById = async (req, res,next) => {
  
    const { messageId } = req.params;

    // البحث في Redis أولاً
    const cachedMessage = await redis.get(`message:${messageId}`);
    if (cachedMessage) {
      console.log(`i get the message ${messageId} from redis`)
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedMessage)
        //  JSON.parse(cachedMessage) => يحول to js object
      });
    }

    // البحث في MongoDB
    // i use findOne because i is unique
    const message = await messageSchema.findOne({ messageId });
    console.log(message)
    if (!message) {
      console.log("first")
   return next(new errorHandling("messageId not found",404))
    }
    // if i get data from mongo 

    // حفظ النتيجة في Redis (تنتهي بعد ساعة)
    // message in redis => jsonSting => json.stringify
    // message i recevied should be jsonobject to can accesss => json.parse
    // summary if i send to redis => stringify --------- if i receive data from redis => json.parse
    await redis.set(`message:${messageId}`, JSON.stringify(message), 'EX', 3600);

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: message
    });

 
};

// 2. جلب رسائل بواسطة sender (يرجع جميع رسائل المرسل مرتبة للأحدث)
export const getMessageBySender = async (req, res,next) => {
  
    const { sender } = req.params;

    // البحث في Redis
    const cachedMessages = await redis.get(`senderMessage:${sender}`);
    if (cachedMessages) {
      console.log(`i get sender message ${sender} from Redis`);
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedMessages)
      });
    }
// if isn't in redis 
// find not findone because send ممكن يتكرر
    // جلب جميع رسائل هذا المرسل وترتيبها من الأحدث للأقدم
    const messages = await messageSchema.find({ sender }).sort({ createdAt: -1 });
    if (!messages || messages.length === 0) {
    return next (new errorHandling("sender is not found",404))
    }
    // save in redis for an hour
    // save data in json 
    // why save it an hour ? because data in json  take مساحة كبيرة من الميموري 
    await redis.set(`senderMessage:${sender}`, JSON.stringify(messages), 'EX', 3600);

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: messages
    });


};

// 3. البحث النصي داخل الرسائل بواسطة $text index
export const getMessageByMessage = async (req, res,next) => {
 
    const { message } = req.params;

    // البحث في Redis
    const cachedResults = await redis.get(`search:${message}`);
    if (cachedResults) {
      console.log(` i got it "${message}" from Redis`);
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedResults)
      });
    }

    //i => case insensetive
    const messages = await messageSchema.find( {message: { $regex: message,$options: "i" }});
    if (!messages || messages.length === 0) {
       return next (new errorHandling("message is not found",404))

    }
// save in redis for an hour
    await redis.set(`search:${message}`, JSON.stringify(messages), 'EX', 3600);

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: messages
    });

 
};