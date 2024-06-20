import mongoose from "mongoose";
const dbName = 'LearnWorld';
const dbUrl = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3'

const connectToDb = {
    connect: ()=>{
        mongoose.connect(dbUrl,{dbName})
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('Error connecting to MongoDB:',error));
    }
}

export default connectToDb