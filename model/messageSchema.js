import mongoose from "mongoose";


const messageSchema=new mongoose.Schema({
    messageId:{
        type:String,
        required:true,
        unique:true // index i can search by it 
    },
    sender:{
        type:String,
        required:true,
    },
    message:{
         type:String,
        required:true,
    }
},
{
    timestamps:true
}
)
messageSchema.index({ sender: 1, createdAt: -1 }); // ترتيب تصاعدي من الاحدث الى الاقدم
// text index
messageSchema.index({ message: "text" });
// الاول عشان لو واحد عاوز يحدد ال sender كاولوية للبحث
// الثاني لو بيعمل ترتيب من الاحدث الى الاقدم عموما 
export default mongoose.models.Message || mongoose.model("Message",messageSchema)