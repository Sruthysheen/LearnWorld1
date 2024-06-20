import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import {generateAccessToken,generateRefreshToken} from "../../Utlitis/generateToken";
import "dotenv/config";
import Student from "../../models/studentModel";
import {sendMail} from "../../middleware/otpMail";
import Course from "../../models/courseModel";
import Category from "../../models/categoryModel";
import CartModel from '../../models/cartModel';
import WishListModel from '../../models/wishlistModel';
import { uploadCloud} from "../../Utlitis/Cloudinary";
import { isAuth } from '../../middleware/authMiddleware';
import Stripe from "stripe";
import orderModel from "../../models/orderModel";
import jwt from "jsonwebtoken";
import Tutor from '../../models/tutorModel';





const appState = {
    otp: null as null | number,
    student: null as null | {
    studentname: string;
    studentemail: string;
    phone: string;
    password: string;

},
};




const studentRegistration = async (req: Request, res: Response) => {
    try {
        const {studentname,studentemail,phone,password} = req.body;
            console.log(req.body,"..................")

            if(!studentname || !studentemail || !phone || !password ) {
                return res.status(400).json({ message: " Fill all the fields "});
            }
        
            const studentExist = await Student.findOne( {studentemail});
            if(studentExist)
            {
                return res.status(400).json({message: "Student already exist"});
            }

            const student = {
                studentname,
                studentemail,
                phone,
                password,
            };
            appState.student = student;

            req.session.student =  student;
            
            
            
            if(student) {
                const mail = sendMail(student.studentemail, res);
               
                console.log(mail,'_______');
                
                req.session.otp = mail;
                 
            
            } else {
                return res.status(400).json({message: "Invalid user data"});
            }

    } catch (error) {
        return res.status(500).json({message : "Error occured"});
    }
};


const verifyOtp = async(req: Request, res: Response) =>{
    try {
       const {otp} = req.body; 
       console.log(otp)
       if(otp==req.session.otp)
       {
        const data=req.session.student
        const addStudent = await Student.create(data);
        const token = generateAccessToken(addStudent._id);

        const datas={
            _id: addStudent?._id,
            name: addStudent?.studentname,
            email: addStudent?.studentemail,
            phone: addStudent?.phone,
            isBlocked:addStudent.isBlocked,
            token,
        }
        return res.status(200).json({
            response:datas,
            token:token
        })
       } else {
        res.status(500).json({message:"Invalid OTP"});
       }
    } catch (error) {
        res.status(400).json({message:"Something went wrong"});
        
    }
}


const otpExpiry=async(req:Request,res:Response)=>{
console.log('here');

    req.session.otp = null
    res.status(200).json({message:"OTP expired please click the resend button "})
}




const studentLogin = async(req: Request, res: Response) =>{
      const {studentemail,password} = req.body;
    
    try {
        
        const student = await Student.findOne({studentemail}).where({isBlocked:false})
        if(!student){
            return res.status(401).json({message:"Student is not existed"});
        }
        if(student?.isBlocked == true)
        {
            return res.status(401).json({message:"Student is blocked"})
        }
        if(student){
        const passwordMatch= await student.matchPassword(password);
        if(passwordMatch)
        {
            const accessToken = generateAccessToken(student._id);
            const refreshToken =generateRefreshToken(student._id)
            req.session.accessToken = accessToken;
            return res.json({response:student,token:refreshToken});
        } 
    } else {
        return res.status(401).json({message:"Invalid email or password"})
    }
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}




const resendOtp = async (req: Request, res: Response) => {
    try {
       

      const email=req.session.student.studentemail

        const otp = sendMail(email, res);
        req.session.otp = otp;

        return res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


const refreshTokenCreation = async(req:Request,res:Response)=>{
    try {
        const token = req.session.accessToken
         console.log(token,"ACESSSSSS");
    
    if(!token)return  res.status(403).json('token is not found')
     let  payload:any
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decode: any) => {
        if (err) {
          return { status: false, message: "error in jwt sign" };
        } else {
            payload = decode;
        }
      });

      if (!payload.student_id)return { status: false, message: "payload is not found" };

      const refreshToken = generateRefreshToken(payload.student_id);
      console.log(refreshToken,'REFRSH TOKEN ');
      
      res.status(200).json( { status: true, token:refreshToken });
    } catch (error) {
        
    }
}



const GoogleAuthentication = async (req: Request, res: Response) => {
    const inComingEmailForVerification = req.query.email;
    console.log(inComingEmailForVerification, "incoming email");
    const userExists = await Student.findOne({
      studentemail: inComingEmailForVerification,
    });
    if (userExists) {
      res.send({ userExist: true });
    } else {
      const us = {
        studentemail: inComingEmailForVerification,
      };
     const user=new Student({
        studentemail:inComingEmailForVerification
     })
     const response=await user.save() 
      if (response) {
        const token = generateAccessToken(response._id);
        console.log("hiiiii");
  
        res.send({ userExist: true, token, response });
      }
    }
  };


// const forgetData = {
//     otp: null as null | number,
// };

const forgotPassword = async (req: Request, res: Response) =>{
    try {
        const {studentemail} = req.body;
        console.log(studentemail);
        if (!req.session.student) {
            req.session.student = {
                studentname: '',
                studentemail: '',
                phone: '',
                password: ''
            };
        }
        req.session.student.studentemail=studentemail;
        
        const studentExists = await Student.findOne({studentemail});
        if(studentExists) {
            const otpReceived= sendMail(studentemail,res);
            console.log(otpReceived,"...............................");
            req.session.otp = otpReceived; 

            res.status(200).json({message:"Email sent successfully"});
        }
        else {
            return res.status(400).json({message: "No user exists"});
        }
    } catch (error) {
        console.log(error)
    }
};





const verifyForgotPassword = async(req: Request, res: Response) =>{
    try {
        const {otp} = req.body;
        console.log(otp,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
        console.log(req.session.otp,"+++++++++++++++");
        
        if(otp == req.session.otp) {
            return res.status(200).json({message: "Success"});
        }
        else {
            return res.status(400).json({message: "Please correct password"});
        }
    } catch (error) {
        console.log(error);
    }
}





const newPassword = async (req: Request, res: Response) => {
    try {
        const {newPassword} = req.body;
        console.log(newPassword,"----------------------------------");
        
        const studentemail = req.session.student.studentemail;
        console.log(studentemail,"............................");
        
        const user = await Student.findOne({ studentemail: studentemail });
        
        if (!user) {
            return res.status(404).send({
                message: `Cannot find user with email: ${studentemail}.`,
            });
        }

        const saltRounds = 10;

        const hash = await bcrypt.hash(newPassword, saltRounds);
        try {
            await Student.findOneAndUpdate({ studentemail: studentemail }, { password: hash });
            res.status(200).send({
                message: "Successfully updated password.",
            });
        } catch (err) {
            res.status(500).send({
                message: "Error updating user information.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "An error occurred.",
        });
    }
};


const getAllCourses = async (req: Request, res: Response) => {
    try {
      const courseDetails = (await Course.find().sort({createdAt:-1}).populate('category').populate('tutor').exec());
      if (courseDetails.length > 0) {
        return res.status(200).json({ courseDetails });
      } else {
        return res.status(404).json({ message: "There are no courses" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
  const addToCart = async (req: Request, res: Response) => {
    try {
        const { studentId, courseId } = req.body; 
        
        const alreadyEnrolled = await orderModel.findOne({ courseId: courseId, studentId: studentId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "Student is already enrolled in this course" });
        }
        const cartItemExisted = await CartModel.findOne({ student: studentId, course: courseId });
        if (cartItemExisted) {
            return res.status(400).json({ message: "Course already exists in the cart" });
        } 
        const newCartItem = new CartModel({ student: studentId, course: courseId });
        await newCartItem.save();
        
        return res.status(200).json({ message: "Course added to cart successfully" });
        
    } catch (error) {
        console.error("Error occurred while adding to cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getCartItems = async(req:Request, res:Response) =>{
    const studentId = req.params.studentId;
    console.log(studentId,"........................");
    
    try {
        const cartItems = await CartModel.find({ student: studentId }).populate("course");
    console.log(cartItems, "items");

    res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart Items", error);
        res.status(500).json({ error: "Internal server Error" });
    }
}


const removeCartItem = async(req:Request,res:Response)=>{
    try {
        const cartItemId = req.params.cartItemId;
        const removedItem = await CartModel.findByIdAndDelete({_id:cartItemId})
        if (!removedItem) {
            return res.status(404).json({ error: "Cart item not found" });
          }
          res.status(200).json({ message: "Course removed from the cart" });
    } catch (error) {
        console.error("Error removing course from cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addToWishlist = async(req:Request, res:Response)=>{
    try {
        const { studentId, courseId } = req.body; 
        const itemExisted = await WishListModel.findOne({student:studentId,course:courseId})
        if(itemExisted){
            return res.status(400).json({message:"Course already existed in Wishlist"})
        } 
        else{
            const newItem = new WishListModel({student:studentId,course:courseId});
            await newItem.save();
            return res.status(200).json({message:"Course added to wishlist successfully"})
        }
    } catch (error) {
        console.error("Error Occur while Adding to wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const  getWishlistItems = async(req:Request, res:Response)=>{
    const studentId = req.params.studentId;
    console.log(studentId,"........................");
    
    try {
        const wishlistItems = await WishListModel.find({ student: studentId }).populate("course");
    console.log(wishlistItems, "items");

    res.status(200).json(wishlistItems);
    } catch (error) {
        console.error("Error fetching cart Items", error);
        res.status(500).json({ error: "Internal server Error" });
    }
}



const removeWishlistItem = async(req:Request, res:Response)=>{
    try {
        const wishlistItemId = req.params.wishlistItemId;
        const removedItem = await WishListModel.findByIdAndDelete({_id:wishlistItemId})
        if (!removedItem) {
            return res.status(404).json({ error: "Wishlist item not found" });
          }
          res.status(200).json({ message: "Course removed from the wishlist" });
    } catch (error) {
        console.error("Error removing course from wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



const StudentEditProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
        const studentId = req.student?._id;
        console.log(studentId);
        console.log(req.body,'==body ');
        console.log(req.file,'Filessss');
        
        
        
        const { studentname, studentemail, phone } = req.body; 
        if (req.file) {
            const file: Express.Multer.File = req.file;
            const buffer: Buffer = file.buffer;
            const imageUrl = await uploadCloud(buffer, file.originalname); 
  console.log(imageUrl,'URL ');
  
    
            const updatedStudent = await Student.findByIdAndUpdate(studentId, {
                studentname,
                studentemail,
                phone,
                photo: imageUrl, 
            },{new:true});
  
            if (updatedStudent) {
                res.status(200).json({ status: true ,data:updatedStudent});
            } else {
                res.status(404).json({ status: false, message: "Tutor not found" });
            }
        } else {
      
            const updatedStudent = await Student.findByIdAndUpdate(studentId, {
                studentname,
                studentemail,
                phone,
            },{new:true});
  
            if (updatedStudent) {
                res.status(200).json({ status: true,data:updatedStudent });
            } else {
                res.status(404).json({ status: false, message: "Student not found" });
            }
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ status: false, message: "Failed to update profile" });
    }
  };

  require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_KEY as string;
console.log(stripeSecretKey, "Keyy");

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10",
});

  const stripePayment = async (req: Request, res: Response) => {
    try {
      console.log(req.body, "bodyyyyyyyyyyyyyyy");
  
      const line_items = req.body.cartItems.map((item: any) => {
        console.log(item, "ONE ITEM");
  
        return {
          price_data: {
            currency: "INR",
            product_data: {
              name: item?.course[0]?.courseName,
              images: item?.course[0]?.photo,
              description: item?.course[0]?.courseDescription,
              metadata: {
                id: item._id,
              },
            },
            unit_amount: item?.course[0]?.courseFee * 100,
          },
          quantity:1,
        };
      });
      console.log(line_items, "LINEITEMSSSS");
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
  
        billing_address_collection: "required",
        success_url: `${process.env.CLIENT_URL}/paymentSuccess`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
      });
  
      console.log(session.payment_status, "status", process.env.CLIENT_URL);
  
      if (session.payment_status === "unpaid") {
        const orderPromises = req.body.cartItems.map(async (cartItem: any) => {
          const studentId = cartItem?.student;
          const tutorId = cartItem?.course[0]?.tutor;
          const courseId = cartItem?.course[0]._id;
          const amount = cartItem?.course[0]?.courseFee;
  
          const order = await orderModel.create({
            studentId: studentId,
            tutorId: tutorId,
            courseId: courseId,
            amount: amount,
          });
  
          await order.save();
  
         
  
          await Course.findByIdAndUpdate(courseId, {
            $push: { students: studentId },
          });
  
          console.log("Order saved:", order);
          return order;
        });
  
        const orders = await Promise.all(orderPromises);
  
        res.json({
          status:true,
          url: session.url,
          orderIds: orders.map((order) => order._id),
          cart:req.body.cartItems
        });
      } else {
        res.status(400).json({ error: "Payment not completed yet." });
      }
    } catch (err) {
      console.error("Stripe Payment Error:", err);
      res.status(500).json({ error: "Payment error" });
    }
  };



  const deleteCart = async(req:Request,res:Response)=>{
    try {
        const studentId = req.body.id;
        console.log(studentId,"iddddddddddddddddddddddddd");
        
        const clearCart = await CartModel.deleteMany({student:studentId})
        if(clearCart.deletedCount > 0){
            return res.json({status:true});
        }
        else {
            return res.json({status:false})
        }
    
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
   
    
  }



  const enrolledCourses =  async(req:Request,res:Response)=>{
    try {
        const studentId = req.params.studentId;
        console.log(studentId,"............");
        
        const enrolledCourses = await orderModel.find({
            studentId:studentId})
            .populate("studentId")
            .populate("courseId")
            .populate("tutorId")
           

            console.log(enrolledCourses,"................");
            

            return res.status(200).json(enrolledCourses)
        
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  }
  

  const fetchCategory = async(req:Request,res:Response)=>{
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.find({_id:categoryId})
        console.log(category,",,,,,,,,,,,,,,,,,,,,,,,,");
        
        if(category){
            return res.status(200).json({category,message:"category fetched"})
        }
        else {
            return res.status(400).json({message:"category not found"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
        
    }
  }


  const getTutorList = async (req: Request, res: Response) => {
    try {
  
      
      const tutorDetails = await Tutor.find().exec();
      if (tutorDetails) {
        res.status(200).json({
          tutorDetails,
        });
      } else {
        return res.status(400).json({
          message: "no users in this table",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  const getTutorDetails = async (req:Request,res:Response)=>{
    try {
      console.log(req.params,"req.params");
      
      const {id}=req.params

      const tutorDetails = await Tutor.findById(id);
      console.log(tutorDetails,"tutorDetails");
      
      if (tutorDetails) {
        res.status(200).json({
          tutorDetails, 
        });
      } else {
        return res.status(400).json({
          message: "no users in this table",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


    const studentLogout = async(req:Request,res:Response)=>{
        try {
            res.status(200).json({message:"Logout successful"})
        } catch (error) {
            console.error("Logout Error:",error);
            res.status(500).json({message:"Internal server error"})
        }
    }





export {
    studentRegistration,
    studentLogin,
    verifyOtp,
    resendOtp,
    forgotPassword,
    verifyForgotPassword,
    newPassword,
    studentLogout,
    otpExpiry,
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
}