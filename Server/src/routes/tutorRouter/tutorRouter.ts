import express from "express";
const tutorRouter = express.Router();

import{tutorRegistration,tutorLogin,verifyOtp, tutorResendOtp, tutorOtpExpiry, tutorForgotPassword, verifyForgotOTP, tutorNewPassword, tutorGoogleAuthentication, editProfile, tutorLogout, addCourses, getAlltutorCourse, editCourse, addNewLesson, editLesson, refreshTokenCreation, GetAllCategory, enrolledStudents, studentProfile} from "../../controller/tutorController/tutorController";

import { protect } from "../../middleware/tutorMiddleware";
import upload from "../../multer/upload"
 

tutorRouter.get("/",(req,res)=>{
    res.json({status:true})
})

tutorRouter.post("/tutorregister", tutorRegistration);
tutorRouter.post("/tutorlogin",tutorLogin);
tutorRouter.get("/firebaseAuthVerify",tutorGoogleAuthentication);
tutorRouter.post("/tutorotp",verifyOtp);
tutorRouter.get("/resendotp",tutorResendOtp);
tutorRouter.get("/otpExpiry",tutorOtpExpiry);
tutorRouter.post("/tutorforgotpassword",tutorForgotPassword);
tutorRouter.post("/verifyforgototptutor",verifyForgotOTP);
tutorRouter.post("/tutornewpassword",tutorNewPassword);
tutorRouter.post("/edit-profile", protect, upload.single('image'), editProfile);
tutorRouter.post("/tutorlogout", tutorLogout);
tutorRouter.post("/addnewcourse", protect, upload.single('image'), addCourses);
tutorRouter.get("/getallcourse/:id",protect,getAlltutorCourse);
tutorRouter.post("/editcourse/:id", protect, upload.single('image'), editCourse);
tutorRouter.post("/addlesson",protect,upload.single('video'),addNewLesson);
tutorRouter.post("/editlesson/:lessonId", protect, upload.single('video'),editLesson);
tutorRouter.get("/get-category",protect,GetAllCategory)
tutorRouter.get("/enrolled-students/:tutorId",protect,enrolledStudents)
tutorRouter.get("/user-profile/:studentId",protect,studentProfile)
tutorRouter.post("/refresh",refreshTokenCreation)



export {tutorRouter}