import mongoose, { Model, Schema, model, Document } from 'mongoose';


interface Chat extends Document {
  conversationId: string;
  participants: mongoose.Schema.Types.ObjectId[]; 
  messages: mongoose.Schema.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}


const chatSchema = new Schema<Chat>(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        tutorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tutor',
        },
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messageModel',
        default: [],
      },
    ],
  },
  {
    timestamps: true, 
  }
);


const ChatModel: Model<Chat> = model<Chat>('Chat', chatSchema);


export default ChatModel;