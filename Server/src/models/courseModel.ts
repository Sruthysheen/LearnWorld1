import mongoose ,{Schema,Document,Model,model} from "mongoose";

export interface LessonProgress {
    lessonId: mongoose.Schema.Types.ObjectId;
    isCompleted: boolean;
}
export interface Course extends Document {
    courseName:string,
    courseDuration :string
    courseDescription :string,
    category:mongoose.Schema.Types.ObjectId,   
    photo:string,
    tutor: mongoose.Schema.Types.ObjectId,  
    students: mongoose.Schema.Types.ObjectId[],
    lessons: string[], 
    isApproved:boolean,
    isLessonCompleted:boolean,
    isEnrolled:boolean,
    courseFee:number,  
    createdAt:Date,
    updatedAt:Date,
    video:string,
    studentsProgress: [{
        studentId: mongoose.Schema.Types.ObjectId,
        progress: LessonProgress[],
    }],
}

const LessonProgressSchema = new Schema<LessonProgress>({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const StudentsProgressSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    progress: [LessonProgressSchema]
});

const courSchema =new Schema<Course>({
    courseName:{
        type:String,
        required:true
    },
    courseDuration:{
        type:String,
        required:true
    },
    courseDescription:{
        type: String,
        required:true
    },     
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "category", 
        required: true   
    },
    courseFee:{
        type:Number,
        required:true
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    isEnrolled:{
        type:Boolean,
        default:false,
    },
    isLessonCompleted:{
        type:Boolean,
        default:false,
    },
    photo:[{
        type:String
    }],
   
    tutor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tutor",
        required:true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      }],
    lessons: [{
       title: {
        type: String,
       },
       description: {
        type: String,
       },
       category: {
        type: String,
        required: true,
       },
       video: {
        type: String,
       },
       isActive: {
        type: Boolean,
        default: true,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      },],  

    studentsProgress: [StudentsProgressSchema],

    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }

    
})


const Course:Model<Course> = mongoose.model<Course>("courseModel",courSchema)

 export default Course
