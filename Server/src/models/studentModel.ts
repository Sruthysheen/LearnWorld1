import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document, model, Model } from "mongoose";


interface InStudent extends Document {
    studentname: string;
    studentemail: string;
    phone: number;
    password: string;
    photo: string;
    createdAt: Date;
    isBlocked: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>

}

const studentSchema = new Schema<InStudent>(
    {
        studentname:{
            type:String,
           
        },
        studentemail:{
            type:String,
            
        },
        phone:{
            type:Number,
           
        },
        password:{
            type:String,
            
        },
        photo: {
            type: String
          },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now,
        },
        isBlocked:{
            type:Boolean,
            required:true,
            default:false,
        }

    },

    {timestamps:true}

);

studentSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

studentSchema.pre<InStudent>("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Student = mongoose.model('Student',studentSchema)

export default Student;

