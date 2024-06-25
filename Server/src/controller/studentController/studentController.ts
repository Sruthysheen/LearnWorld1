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
import Wallet from '../../models/walletModel';
import ratingModel from '../../models/ratingModel';
import Question from '../../models/questionModel';





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
            return res.json({status:false,message:"Student is not existed"});
        }
        if(student?.isBlocked == true)
        {
            return res.json({status:false,message:"Student is blocked"})
        }
        if(student){
        const passwordMatch= await student.matchPassword(password);
        if(passwordMatch)
        {
            const accessToken = generateAccessToken(student._id);
            const refreshToken =generateRefreshToken(student._id)
            req.session.accessToken = accessToken;
            return res.json({status:true,response:student,token:refreshToken});
        }else{
          return res.json({status:false,message:"Invalid email or password"})
        } 
    } else {
        return res.json({status:false,message:"Invalid email or password"})
    }
    } catch (error) {
        return res.json({status:false,message:"Internal server error"})
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
            paymentMethod: 'Stripe',
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
            .populate("tutorId").sort({createdAt:-1})
           

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



  const cancelCourse = async (req:Request, res:Response) => {
    try {
      const { courseId, studentId } = req.body;
      console.log(req.body, "**********************************");
      const courseOrder = await orderModel.findOne({ courseId: courseId, studentId: studentId });
  
      if (!courseOrder) {
        return res.status(400).json({ message: "Course not found" });
      }
  
      const coursePrice = courseOrder.amount;  
      const courseCancelled = await orderModel.findOneAndDelete({ courseId: courseId, studentId: studentId });
      console.log(courseCancelled);
  
      if (courseCancelled) {
        let studentWallet = await Wallet.findOne({ studentId: studentId });
  
        if (!studentWallet) {
          studentWallet = new Wallet({
            studentId: studentId,
            balance: coursePrice,
            transactions: [{
              type: 'credit',
              amount: coursePrice,
              date: new Date(),
            }],
            enrollments: [{
              courseId: courseId,
              date: new Date(),
              refunded: true,
            }],
          });
        } else {
         
          studentWallet.balance += coursePrice;
          studentWallet.transactions.push({
            type: 'credit',
            amount: coursePrice,
            date: new Date(),
          });
  
          const enrollment = studentWallet.enrollments.find(enrollment =>
            enrollment.courseId.toString() === courseId.toString()
          );
  
          if (enrollment) {
            enrollment.refunded = true;
          } else {
            studentWallet.enrollments.push({
              courseId: courseId,
              date: new Date(),
              refunded: true,
            });
          }
        }
  
        await studentWallet.save();
  
        return res.status(200).json({ message: "Course cancelled and amount refunded to wallet" });
      } else {
        return res.status(400).json({ message: "Not able to cancel the course" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }


  const getBalance = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      console.log(studentId, "..............................");
  
      const wallet = await Wallet.findOne({ studentId });
  
      if (wallet) {
        return res.status(200).json(wallet.balance);
      } else {
        return res.status(400).json({ message: "Balance is not available" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  const getTransactions = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      console.log(studentId, "..............................");
  
      const wallet = await Wallet.findOne({ studentId });
  
      if (wallet && wallet.transactions.length > 0) {
        
        return res.status(200).json(wallet.transactions);
      } else {
        return res.status(404).json({ message: "Transactions are not available" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  const updateWalletBalance = async (req: Request, res: Response) => {
    try {
      const { studentId, amount, cartItems } = req.body;
  
      const wallet = await Wallet.findOne({ studentId });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
  
      if (wallet.balance + amount < 0) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      wallet.balance += amount;
      wallet.transactions.push({
        type: amount < 0 ? 'debit' : 'credit',
        amount: Math.abs(amount),
        date: new Date(),
      });
      const orders = cartItems.map((cartItem: any) => ({
        studentId: studentId,
        tutorId: cartItem.course[0]?.tutor,
        courseId: cartItem.course[0]._id,
        amount: cartItem.course[0]?.courseFee,
        status: 'success',
        paymentMethod:'Wallet',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
  
      await orderModel.insertMany(orders);
      await wallet.save();
  
      res.status(200).json({ message: 'Wallet balance updated and orders created successfully', walletBalance: wallet.balance });
    } catch (error) {
      console.error("Error updating wallet balance and creating orders:", error);
      res.status(500).json({ message: 'Error updating wallet balance and creating orders' });
    }
  }


  const postReview = async (req: Request, res: Response) => { 
    try {
      const { review, rating, courseId, studentId } = req.body;
      console.log(req.body); 
  
      let submittedReview = await ratingModel.findOne({ courseId: courseId, studentId: studentId });
      if (!submittedReview) {
        submittedReview = new ratingModel({
          courseId: courseId,
          studentId: studentId, 
          rating: rating,
          review: review
        });
        await submittedReview.save();
      } else {
        submittedReview.review = review;
        submittedReview.rating = rating;
        await submittedReview.save();
      }
      res.status(200).json({ message: "Review submitted successfully", rating: submittedReview });
    } catch (error) {
      console.error("Error while submitting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  const getRating = async (req:Request, res:Response) => {
    try {
      const { courseId, studentId } = req.params; 
      const studentRating = await ratingModel.find({ courseId, studentId }).populate('studentId');
      if (!studentRating) {
        return res.status(400).json({ message: "Rating details not found" });
      } else {
        return res.status(200).json({ message: "My rating details", data:studentRating });
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const getAllRatings = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }
  
      const allRatings = await ratingModel.find({ courseId }).populate('studentId');
  
      if (allRatings.length > 0) {
        return res.status(200).json({ message: "Ratings are fetched", allRatings });
      } else {
        return res.status(404).json({ message: "There are no ratings for this course" });
      }
    } catch (error) {
      console.error("Error while fetching ratings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const fetchQuizzesByCourse = async(req:Request,res:Response)=>{
    try {
      const {courseId} = req.params;
      const questions = await Question.find({ courseId })
        return res.status(200).json(questions);
    } catch (error:any) {
      console.error("Error while fetching ratings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  


  const getAverageRatings = async (req: Request, res: Response) => {
    try {
      const averageRatings = await ratingModel.aggregate([
        {
          $group: {
            _id: "$courseId",
            averageRating: { $avg: "$rating" },
            ratingCount: { $sum: 1 }
          }
        }
      ]);
  
      if (averageRatings.length > 0) {
        return res.status(200).json({ averageRatings });
      } else {
        return res.status(404).json({ message: "No ratings found" });
      }
    } catch (error) {
      console.error("Error fetching average ratings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const updatedProgress = async(req:Request,res:Response)=>{
    const { courseId, studentId, lessonId } = req.body;

    try {
      const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        const studentProgress = course.studentsProgress.find(sp => sp.studentId.toString() === studentId);

        if (studentProgress) {
            const lessonProgress = studentProgress.progress.find(lp => lp.lessonId.toString() === lessonId);
            if (lessonProgress) {
                lessonProgress.isCompleted = true;
            } else {
                studentProgress.progress.push({ lessonId, isCompleted: true });
            }
        } else {
            course.studentsProgress.push({
                studentId,
                progress: [{ lessonId, isCompleted: true }]
            });
        }

        await course.save();
        res.status(200).send({ message: 'Progress updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to update progress', error });
    }
  }


  const fetchProgress = async(req:Request,res:Response)=>{
    const { courseId, studentId } = req.params;
    try {
      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ msg: 'Course not found' });
      }
      const studentProgress = course.studentsProgress.find(sp => sp.studentId.toString() === studentId);
      if (!studentProgress) {
          return res.json({ status: true, data: { watchedLessons: [] } });
      }
      const watchedLessons = studentProgress.progress.filter(lesson => lesson.isCompleted);

      res.json({ status: true, data: { watchedLessons } });
    } catch (error) {
      console.error('Error fetching student progress:', error);
      res.status(500).send('Server Error');
    }
  }
  
  


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
    getTutorDetails,
    cancelCourse,
    getBalance,
    getTransactions,
    updateWalletBalance,
    postReview,
    getRating,
    getAllRatings,
    fetchQuizzesByCourse,
    getAverageRatings,
    updatedProgress,
    fetchProgress
}