import express from "express";
const studentRouter = express.Router();

import {generateRefreshToken} from '../../Utlitis/generateToken'
import{studentRegistration,
       studentLogin,verifyOtp, 
       resendOtp, 
       forgotPassword, 
       verifyForgotPassword, 
       newPassword,
       otpExpiry,
       studentLogout,
       GoogleAuthentication,
       getAllCourses,
       addToCart,
       getCartItems,
       removeCartItem,
       addToWishlist,
       getWishlistItems,
       removeWishlistItem,
       StudentEditProfile,
       stripePayment,
       deleteCart,
       refreshTokenCreation,
       enrolledCourses,
       fetchCategory,
       getTutorList,
       getTutorDetails
    } from "../../controller/studentController/studentController";
import { isAuth } from "../../middleware/authMiddleware";
import upload from "../../multer/upload";
import { GetAllCategory } from "../../controller/tutorController/tutorController";


studentRouter.get("/",(req,res)=>{
    res.json({status:true})
})

studentRouter.post("/register", studentRegistration);
studentRouter.post("/login",studentLogin);
studentRouter.post("/otp",verifyOtp);
studentRouter.get("/resendotp",resendOtp);
studentRouter.get("/otpExpiry",otpExpiry);
studentRouter.get("/firebaseAuthVerify", GoogleAuthentication);
studentRouter.post("/forgotpassword",forgotPassword);
studentRouter.post("/verifyforgototp",verifyForgotPassword);
studentRouter.post("/newpassword",newPassword);
studentRouter.get("/getcourses",getAllCourses);
studentRouter.get("/get-category",GetAllCategory)
studentRouter.post("/addtocart",isAuth,addToCart);
studentRouter.get("/cart/:studentId",isAuth,getCartItems);
studentRouter.delete("/removecartitem/:cartItemId",isAuth,removeCartItem);
studentRouter.post("/addtowishlist",isAuth,addToWishlist);
studentRouter.get("/wishlist/:studentId",isAuth,getWishlistItems);
studentRouter.delete("/removeitem/:wishlistItemId",isAuth,removeWishlistItem);
studentRouter.post("/editprofile", isAuth, upload.single('image'), StudentEditProfile);
studentRouter.post('/stripepayment',stripePayment)
studentRouter.post('/clear-cart',isAuth,deleteCart)
studentRouter.get('/enrolled-course/:studentId',isAuth,enrolledCourses)
studentRouter.get('/get-category/:categoryId',isAuth,fetchCategory)
studentRouter.get('/get-tutor/:id',isAuth,getTutorDetails)
studentRouter.get('/tutor-list',isAuth,getTutorList)
studentRouter.post("/logout",studentLogout);
studentRouter.get('/test',isAuth,(req,res)=>{
    res.status(200).json({message:"Hello"})
})

studentRouter.post("/refresh",refreshTokenCreation)


export {studentRouter}