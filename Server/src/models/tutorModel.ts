import bcrypt from 'bcryptjs';
import mongoose, {Schema, Document, model, Model} from "mongoose";


interface InTutor extends Document {
    tutorname: string;
    tutoremail: string;
    phone: number;
    password: string;
    photo: string;
    courses: mongoose.Schema.Types.ObjectId,
    createdAt: Date;
    isBlocked: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;

}

const tutorSchema = new Schema<InTutor>(
    {
        tutorname:{
            type: String,
        },
        tutoremail:{
            type: String,
        },
        phone:{
            type: Number,
        },
        password:{
            type: String,
        },
        photo: 
        {
          type: String,
        },
        courses: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseModel",
          },
        createdAt:{
            type: Date,
            required: true,
            default: Date.now,
        },
        isBlocked:{
            type:Boolean,
            required:true,
            default:false,
        }
    },
    {timestamps: true}
);

tutorSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

tutorSchema.pre<InTutor>("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Tutor = mongoose.model("Tutor",tutorSchema)

export default Tutor;
