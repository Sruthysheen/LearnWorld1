import mongoose, { Schema,Model, model, Document } from "mongoose";


interface Rating extends Document { 
    courseId: mongoose.Schema.Types.ObjectId; 
    studentId: mongoose.Schema.Types.ObjectId;
    rating: number;
    review : string;
    createdAt: Date;
}
const ratingSchema = new Schema<Rating>({  
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courseModel'
},
studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
    },

rating: {
      type:Number,
      required:true,
    },
review :{
      type:String,    
    },
        
createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

});

const ratingModel: Model<Rating> = mongoose.model<Rating>('ratingModel', ratingSchema);

export default ratingModel;