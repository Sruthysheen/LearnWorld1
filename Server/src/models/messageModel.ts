import mongoose, { Document, Model, Schema } from 'mongoose';


interface Message extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}


const messageSchema = new mongoose.Schema<Message>({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chatModel',
    required: true,
    index: true, 
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true, 
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  message: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: true, 
});


const MessageModel: Model<Message> = mongoose.model<Message>('message', messageSchema);

export default MessageModel;