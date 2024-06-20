import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Tutor from "../models/tutorModel"; 
import dotenv from "dotenv";
import { Document } from "mongoose";
dotenv.config();

interface TutorData {
    _id: string;
    tutorname: string;
    tutor: any | null;
}

declare global {
    namespace Express {
        interface Request {
            tutor?: TutorData;
        }
    }
}

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
    
    const token = req.headers.authorization?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_REFRESHSECRET as string;
    console.log(token,'-----',JWT_SECRET,".................");
    if (token) {
        try {
            const verifiedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
            console.log(verifiedToken,'-----');
            
            const tutorId: string = verifiedToken.student_id; 

            const tutor: Document | null = await Tutor.findById(tutorId).select("-password");
console.log(tutor);

            if (tutor) {
                req.tutor = tutor as unknown as TutorData;
                next();
            }  else{
                res.status(403);
                throw new Error("Tutor not found");
            }
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    }

    if(!token)
        {
            res.status(401).send("Token not found");
        }

});

export { protect };
