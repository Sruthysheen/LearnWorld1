import express from 'express';
import { fetchChats, sendMessage ,createConversation, getUserMessages} from '../../controller/chatController/chatController';
import { isAuth } from '../../middleware/authMiddleware';
import { protect } from '../../middleware/tutorMiddleware';
const chatRouter = express.Router();


chatRouter.post('/send-message',isAuth, sendMessage);
chatRouter.get('/fetch-chat',isAuth, fetchChats);
chatRouter.get('/fetch-tutor-chat',protect, fetchChats);
chatRouter.post('/createConversation',isAuth,createConversation)
chatRouter.post('/getUserMessages',getUserMessages)


export default chatRouter