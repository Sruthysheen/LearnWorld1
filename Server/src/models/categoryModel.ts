import { Schema, Document, model, Model } from "mongoose";


interface CATEGORY extends Document {
    categoryname: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
  }
  
  const categorySchema = new Schema<CATEGORY>(
    {
      categoryname: {
        type: String,
        required: true,
      },
      description:{
        type:String,
        required:true
    },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );
  
  const Category: Model<CATEGORY> = model<CATEGORY>(
    "category",
    categorySchema
  );
  export default Category;