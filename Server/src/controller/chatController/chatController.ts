import { Request, Response } from 'express';
import chatModel from '../../models/chatModel';
import MessageModel from '../../models/messageModel';
import ChatModel from '../../models/chatModel';
import Student from '../../models/studentModel';

const sendMessage = async (req: any, res: Response) => {
    
    try{
      console.log(req.userId,"req.userIdreq.userId");
      
      const myId=req.userId
      console.log(myId,"myId");
      console.log(req.body,"req.bodyreq.body");
      
        const { message , userId } = req.body;
        console.log(message,"message")
        if (!message) {
        return res.status(400).json({ error: 'Message is required' });
        }
        let chatId
        let chat = await chatModel.findOne({
            participants:{$all:[myId,userId]}
        });
        if(!chat){
          console.log("!chat");
            chat = await chatModel.create({
                participants :[myId,userId]
            })
        }
        console.log(chat,"chatchat");
        chatId=chat._id
        const newMessage = new MessageModel({
          conversationId:chatId,
          senderId: myId ,
          receiverId: userId ,
          message ,
        })
        await newMessage.save();
        res.status(201).json({ message:"message created successfully"});
    }
    catch(error){
        console.log("error while creating message",error)
        res.status(500).json({error:"Internal server Error"})
    } 
  };
  

  const fetchChats = async (req: Request, res: Response) => {
    
    try {
      console.log(req.query,"req.param");
      
        const { id } = req.query; 

        
        const messages=await MessageModel.find({conversationId:id})
        
        if(messages.length > 0 ){
          console.log("message fetch");
          
           return res.status(200).json({status:true,data:messages})
        }else{
          console.log("no message fetch");
          return res.status(200).json({status:true,data:[]})
          

        }
        
        
       
    } catch (error) {
        console.error("Error in fetchChats:", error);
        res.status(400).json({status:false, message: "Error while fetching messages" });
    }
  };
  
  

  const createConversation = async (req:Request, res:Response) => {
    const { userId, tutorId } = req.body;
  
    try {
      // Check if a conversation already exists
      const alreadyExist = await chatModel.findOne({
        participants: {
          $all: [
            { $elemMatch: { userId } },
            { $elemMatch: { tutorId } },
          ],
        },
      });
  
      if (alreadyExist) {
        return res.status(200).json({ status: true, data: alreadyExist });
      }
  
      // Create a new conversation if it doesn't exist
      const newConversation = await chatModel.create({
        participants: [
          {
            userId,
            tutorId,
          },
        ],
      });
  
      console.log(newConversation, 'THIS IS NEW CONVERSATION');
  
      if (newConversation) {
        return res.status(200).json({ status: true, data: newConversation });
      } else {
        return res.status(400).json({ status: false, message: 'New Conversation creation failed ...!' });
      }
    } catch (error) {
      return res.status(400).json({ status: false, message: `Something went wrong ..! ${error}` });
    }
  };

   const getUserMessages =async(req:Request,res:Response)=>{
    const {tutorId}=req.body
    console.log(tutorId,")))))))");
    
    try {
      const messageDataAndUserData = await chatModel.find({
        'participants.tutorId': tutorId
      }).populate("participants.userId");
  
  if(messageDataAndUserData){
    return res.status(200).json({status:true,data:messageDataAndUserData})
  }else{
    return res.status(400).json({status:false,message:"NO DATA FOUND"})
  
  }
  
    } catch (error) {
    return res.status(400).json({status:false,message:`Some thing went wrong ...! ${error}`})
      
    }


  }


  const createAMessage=async(data:any)=>{
    try {
      const { 
        conversationId,
        senderId,
        receiverId,
        message}=data

        const newMessage= await MessageModel.create({
          conversationId,
          senderId,
          receiverId,
          message
        })

        if(newMessage){
          return {status:true,data:newMessage}
        }else{
      return {status:false,message:`new message Creation failed..!`}

        }
    } catch (error) {
      return {status:false,message:`something went wrong ${error}`}
    }
  }
  
  export {
      sendMessage,
        fetchChats,    
      createConversation   ,
      getUserMessages,
      createAMessage
        };