import mongoose from "mongoose";
const dbName = 'LearnWorld';
const dbUrl = process.env.MONGO_URL

const connectToDb = {
    connect: ()=>{
        mongoose.connect(dbUrl,{dbName})
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('Error connecting to MongoDB:',error));
    }
}

export default connectToDb