import mongoose, { Schema, Document, Model, model } from "mongoose";

interface OptionDoc extends Document {
    optionText: string;
    isCorrect: boolean;
}

interface QuestionDoc extends Document {
    courseId: mongoose.Schema.Types.ObjectId
    tutorId: mongoose.Schema.Types.ObjectId
    questionText: string;
    options: OptionDoc[];
}

const optionSchema = new Schema<OptionDoc>({
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});

const questionSchema = new Schema<QuestionDoc>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "courseModel",
        required: true,
    },
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
    },
    questionText: { type: String, required: true },
    options: [optionSchema],
});

const Question: Model<QuestionDoc> = model<QuestionDoc>("Question", questionSchema);

export default Question;
