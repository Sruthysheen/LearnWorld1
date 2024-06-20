import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Student from "../models/studentModel"
import dotenv from "dotenv";
import { Document } from "mongoose";
dotenv.config();


interface StudentData {
    _id: string;
    studentname: string;
    student: any | null;
}


declare global{
    namespace Express{
        interface Request{
            student?:StudentData;
        }
    }
}


const isAuth = asyncHandler(
    
    async(req:Request, res:Response, next:NextFunction) =>{
        console.log(req.headers,'ppp[pp');
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        
        const JWT_SECRET = process.env.JWT_REFRESHSECRET as string;

        if(token)
        {
            try {
                const verifiedToken = jwt.verify(token,JWT_SECRET) as JwtPayload;
                
                console.log(verifiedToken,'-----');

                const studentId: string = verifiedToken.student_id;

                const student = await Student.findById(studentId).select("-password");
                
                if(student){
                    req.student = student as unknown as StudentData;
                    next();
                }
                else{
                    res.status(403);
                    throw new Error("Student not found");
                }
            } catch (error) {
                console.log(error,'0000000000000');
                
                res.status(401);
                throw new Error("Not authorized, invalid token");
            }
        }

        if(!token)
        {
            res.status(401).send("Token not found");
        }

    
    }
);

export {isAuth};



