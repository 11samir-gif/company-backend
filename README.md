
const messages = await messageSchema.find({ 
        message: { $regex: message,$options: "i" } // "i" لتجاهل حالة الأحرف (Case-insensitive)
    });
    //use it 
    { $regex: message }:

$regex: هو عامل (Operator) في MongoDB يُستخدم للبحث النمطى (Pattern Matching). بدلاً من البحث عن الكلمة مطابقة تماماً (Exact Match)، يتيح لك البحث عن جزء من الكلمة أو مطابقة نمط معين.

message (الثانية): هو المتغير القادم من الـ URL (أي ما كتبه المستخدم في البحث، مثل "Hel" أو "Hello"). بفضل Regex، إذا بحث المستخدم عن "Hel"، فسيقوم بإيجاد الرسائل التي تحتوي على هذا المقطع مثل "Hello World" أو "Help me"، على عكس الـ Text Index العادي الذي كان يبحث عن الكلمة كاملةً.

$options: "i":

حرف الـ i يرمز إلى Case-Insensitive (غير حساس لحالة الأحرف).

هذا الخيار مهم جداً لكي لا يفرق البحث بين الحروف الكبيرة (Uppercase) والصغيرة (Lowercase). فمثلاً، لو بحث المستخدم عن "hello" أو "HELLO" أو "Hel", سيتم