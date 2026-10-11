import express from 'express'
import { getMessageById, getMessageByMessage, getMessageBySender } from '../controller/messageController.js';
import asyncHandler from 'express-async-handler'
const messageRouter=express.Router()

// get message by id
messageRouter.get('/search/:message',asyncHandler(getMessageByMessage))
messageRouter.get('/sender/:sender',asyncHandler(getMessageBySender))
messageRouter.get('/:messageId', asyncHandler(getMessageById));
export default messageRouter