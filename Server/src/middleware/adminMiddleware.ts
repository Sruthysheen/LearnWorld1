import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Admin from "../models/adminModel";
dotenv.config();

interface AdminData {
    _id: string;
    adminemail: string;
    admin: any | null;
}

declare global {
    namespace Express {
        interface Request {
            admin?: AdminData;
        }
    }
}

const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers, 'ppp[pp');
    
    const token = req.headers.authorization?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_REFRESHSECRET as string;
    console.log(token, '-----', JWT_SECRET, ".................");

    if (token) {
        try {
            const verifiedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
            console.log(verifiedToken, '-----');

            const adminId: string = verifiedToken.student_id as string;

            const admin = await Admin.findById(adminId).select("-password");

            if (admin) {
                req.admin = admin.toObject() as AdminData;
                next();
            } else {
                res.status(403);
                throw new Error("Admin not found");
            }
        } catch (error) {
            res.status(401).send("Not authorized, invalid token");
        }
    } else {
        res.status(401).send("Token not found");
    }
});

export { isAdmin };
