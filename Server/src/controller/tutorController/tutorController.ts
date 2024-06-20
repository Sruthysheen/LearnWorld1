import { NextFunction, Request, Response, response } from "express";
import bcrypt from "bcryptjs";
import {generateAccessToken,generateRefreshToken} from "../../Utlitis/generateToken";
import "dotenv/config";
import Tutor from "../../models/tutorModel";
import { sendMail } from "../../middleware/otpMail";
import { uploadCloud} from "../../Utlitis/Cloudinary";
import { protect } from "../../middleware/tutorMiddleware";
import Course from "../../models/courseModel";
import Category from "../../models/categoryModel";
import jwt from "jsonwebtoken";
import Student from "../../models/studentModel";
import orderModel from "../../models/orderModel";

const appState = {
  otp: null as null | number,
  tutor: null as null | {
    tutorname: string;
    tutoremail: string;
    phone: string;
    password: string;
  },
};

const tutorRegistration = async (req: Request, res: Response) => {
  try {
    const { tutorname, tutoremail, phone, password } = req.body;

    if (!tutorname || !tutoremail || !phone || !password) {
      return res.status(400).json({ message: "Fill all the fields" });
    }

    const tutorExist = await Tutor.findOne({ tutoremail });
    if (tutorExist) {
      return res.status(400).json({ message: "Tutor already exists" });
    }

    const tutor = {
      tutorname,
      tutoremail,
      phone,
      password,
    };
    appState.tutor = tutor;

    req.session.tutor = tutor;

    if (tutor) {
      const mail = sendMail(tutor.tutoremail, res);
      req.session.otp = mail;
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error occurred" });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    console.log(otp,"---------------------------------------------------");
    
    if (otp == req.session.otp) {
      const data = req.session.tutor;
      const addTutor = await Tutor.create(data);
      const token = generateAccessToken(addTutor._id);
      const datas={
        _id: addTutor?._id,
        tutorname: addTutor?.tutorname,
        tutoremail: addTutor?.tutoremail,
        phone: addTutor?.phone,
        isBlocked: addTutor.isBlocked,
        photo:"",
        token,
      }
      return res.status(200).json({
        response:datas,
        token:token
      });
    } else {
      res.status(500).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const tutorLogin = async (req: Request, res: Response) => {
  const { tutoremail, password } = req.body;

  try {
    const tutor = await Tutor.findOne({ tutoremail }).where({
      isBlocked: false,
    });
    if (!tutor) {
      return res.status(401).json({ message: "Tutor does not exist" });
    }
    if (tutor?.isBlocked == true) {
      return res.status(401).json({ message: "Tutor is blocked" });
    }
    if (tutor) {
      const passwordMatch = await tutor.matchPassword(password);
      if (passwordMatch) {
        const accessToken = generateAccessToken(tutor._id);
            const refreshToken =generateRefreshToken(tutor._id)
            req.session.accessToken = accessToken;
            return res.json({response:tutor,token:refreshToken});
      }
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const tutorResendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.session.tutor.tutoremail;
    const otp = sendMail(email, res);
    req.session.otp = otp;

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const tutorOtpExpiry = async (req: Request, res: Response) => {
  req.session.otp = null;
  res
    .status(200)
    .json({ message: "OTP expired please click the resend button" });
};



const tutorGoogleAuthentication = async (req: Request, res: Response) => {
  const inComingEmailForVerification = req.query.email;
  const name=req.query.name
  console.log(inComingEmailForVerification, "incoming email");
  const userExists = await Tutor.findOne({

    tutoremail: inComingEmailForVerification,
  });
  if (userExists) {
    res.send({ userExist: true ,response:userExists});
  } else {
    const us = {
      tutoremail: inComingEmailForVerification,
    };
    const user = new Tutor({
      tutorname:name,
      tutoremail: inComingEmailForVerification,
    });
    const response = await user.save();
    if (response) {
      const token = generateAccessToken(response._id);
      console.log("hiiiii");

      
      // res.send({ userExist: true, token});

      res.send({ userExist: true, token ,response});

    }
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




const tutorForgotPassword = async (req: Request, res: Response) => {
  try {
    const { tutoremail } = req.body;
    console.log(tutoremail);
    if (!req.session.tutor) {
      req.session.tutor = {
        tutorname: "",
        tutoremail: "",
        phone: "",
        password: "",
      };
    }
    req.session.tutor.tutoremail = tutoremail;

    const tutorExists = await Tutor.findOne({ tutoremail });
    if (tutorExists) {
      const otpReceived = sendMail(tutoremail, res);
      console.log(otpReceived, "...............................");
      req.session.otp = otpReceived;

      res.status(200).json({ message: "Email sent successfully" });
    } else {
      return res.status(400).json({ message: "No user exists" });
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyForgotOTP = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    // const email=req.session.tutor.tutoremail
    console.log(otp,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
    console.log(req.session.otp,"+++++++++++++++");

    if (otp == req.session.otp) {
      // const tutor=await Tutor.findOne({ email });
      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(400).json({ message: "Please correct password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const tutorNewPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    console.log(newPassword, "----------------------------------");

    const tutoremail = req.session.tutor.tutoremail;
    console.log(tutoremail, "............................");

    const user = await Tutor.findOne({ tutoremail: tutoremail });

    if (!user) {
      return res.status(404).send({
        message: `Cannot find user with email: ${tutoremail}.`,
      });
    }

    const saltRounds = 10;

    const hash = await bcrypt.hash(newPassword, saltRounds);
    try {
      await Tutor.findOneAndUpdate(
        { tutoremail: tutoremail },
        { password: hash }
      );
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
// interface customRequest extends Request {
//   file?: Express.Multer.File;
//   files?: Express.Multer.File[];
// }
// type Middleware = (
//   req: customRequest,
//   res: Response,
//   next: NextFunction
// ) => void;

const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
      const tutorId = req.tutor?._id;
      console.log(tutorId);
      console.log(req.body,'==body ');
      console.log(req.file,'Filessss');
      
      
      
      const { tutorname, tutoremail, phone } = req.body; 
      if (req.file) {
          const file: Express.Multer.File = req.file;
          const buffer: Buffer = file.buffer;
          const imageUrl = await uploadCloud(buffer, file.originalname); 
console.log(imageUrl,'URL ');

  
          const updatedTutor = await Tutor.findByIdAndUpdate(tutorId, {
              tutorname,
              tutoremail,
              phone,
              photo: imageUrl, 
          },{new:true});

          if (updatedTutor) {
              res.status(200).json({ status: true ,data:updatedTutor});
          } else {
              res.status(404).json({ status: false, message: "Tutor not found" });
          }
      } else {
    
          const updatedTutor = await Tutor.findByIdAndUpdate(tutorId, {
              tutorname,
              tutoremail,
              phone,
          },{new:true});

          if (updatedTutor) {
              res.status(200).json({ status: true,data:updatedTutor });
          } else {
              res.status(404).json({ status: false, message: "Tutor not found" });
          }
      }
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ status: false, message: "Failed to update profile" });
  }
};



const editCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    console.log(courseId,"........................");
   
    
    const {
      courseName,
      courseDescription,
      courseDuration,
      category,
      courseFee,
      tutor
    } = req.body;
    const cate = JSON.parse(category) 
    console.log(req.body,"=====================");
    

    let imageUrl = "";

    if (req.file) {
      const file: Express.Multer.File = req.file;
      const buffer: Buffer = file.buffer;
      imageUrl = await uploadCloud(buffer, file.originalname);
      console.log(imageUrl, 'URL ');
    }
    console.log(cate);
    
    const categoryObj = await Category.findOne({categoryname:cate.categoryname});
console.log(categoryObj,'***********');

    if (!categoryObj) {
      return res.status(400).json({ status: false, message: "Category not found" });
    }

    const updatedCourseData: any = {
      courseName,
      courseDescription,
      courseDuration,
      category: categoryObj._id,
      courseFee,
    };

    if (imageUrl) {
      updatedCourseData.photo = imageUrl;
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true });

    if (updatedCourse) {
      console.log(req.body, "Body data");
      res.status(200).json({ status: true, data: updatedCourse });
    } else {
      res.status(404).json({ status: false, message: "Course not found" });
    }

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ status: false, message: "Failed to update course" });
  }
}


const GetAllCategory = async (req: Request, res: Response) => {
  try {
    const categoryDetails = await Category.find({ isDeleted: false }).exec();

    if (categoryDetails) {
      return res.status(200).json({
        categoryDetails
      });
    } else {
      return res.status(400).json({ message: "Category does not exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




const addCourses = async (req: Request, res: Response) => {
  console.log("I'm adding course");

  try {
    const {
      courseName,
      courseDescription,
      courseDuration,
      category,
      courseFee, 
      tutor
    } = req.body;

    if (req.file) {
      const file: Express.Multer.File = req.file;
      const buffer: Buffer = file.buffer;
      const imageUrl = await uploadCloud(buffer, file.originalname);
if(imageUrl){
  console.log(req.body, "Body data");
const categorys:any=await Category.findOne({categoryname:category})
      const course = await Course.create({
        courseName,
        courseDescription,
        category:categorys._id,
        courseFee, 
        courseDuration,
        photo: imageUrl, 
        tutor
      });
      const response=await course.save();
      if (response) {
        console.log("sending req to frnd",response);
        return res.status(200).json({status:true,data:response});
       
      } else {
        res.status(400).json({ status:false, message: "Invalid Data Entry" });
      }
}
    
    } else {
      res.status(400).json({ status:false,message: "No file uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status:false, message: "Internal Server Error" });
  }
};



const getAlltutorCourse = async (req:Request,res:Response)=>{
  try{
    const id=req.params.id
    const courseDetails = await Course.find({tutor:id}).populate('category').exec();
  console.log("Fetched Course Details:", courseDetails);
    if(courseDetails){
      res.status(200).json({
        courseDetails,message:"courseDetails"
      })
    }else{
      return res.status(400).json({
        error:"no course available "
      })
    }
  }
  catch(error){
    console.log(error);
  }
}

const addNewLesson = async(req:Request,res:Response)=>{
  try {
    console.log(req.body,"---------------------------",req.file);
    
    const {category,description,title,courseId} = req.body;

      const file: any = req?.file;
      const buffer: Buffer = file.buffer;
      console.log(file,"FILEE");
      
      const imageUrl = await uploadCloud(buffer, file.originalname);

      if(imageUrl){
        const video=imageUrl
        const lessonAddedCourse = await Course.findByIdAndUpdate(
          courseId,
          { $push: { lessons: { courseId: courseId,category, description, title, video} } },
          { new: true }
        );
        console.log(lessonAddedCourse,"...///...//...//..///");
        
  if(lessonAddedCourse){
    return res.status(200).json(lessonAddedCourse);
  } else {
    return res.status(400).json({error:"Course not found"});
  }
      }
    
    
  } catch (error) {
    res.status(500);
    throw error;
  }
}


const editLesson = async (req: Request, res: Response) => {
  try {
    
    const lessonId = req.params.lessonId; 
    console.log(lessonId,"...................");
    
    const {courseId, category, description, title } = req.body;
    console.log(req.body);
    

    
    const file: any = req.file;
    const videoUrl = file ? await uploadCloud(file.buffer, file.originalname) : undefined;

    // Construct lesson update data
    const updateData: any = {};
    if(courseId) updateData.courseId = courseId;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (title) updateData.title = title;
    if (videoUrl) updateData.video = videoUrl;

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, "lessons._id": lessonId }, 
      { $set: { "lessons.$": updateData } }, 
      { new: true }
    );

    if(updatedCourse){
      return res.status(200).json({data:updatedCourse});
    }
    else {
      return res.status(400).json({error:"Course not updated"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const enrolledStudents =  async(req:Request,res:Response)=>{
  try {
    console.log("hiiiiiiiiiiiiiiiiii");
    

const tutorId = req.params.tutorId;

console.log(req.body);

    const studentData =await orderModel.find({tutorId}).populate('studentId').populate('courseId').exec()
      

    if(studentData){
      
const students:any=[]
      for(let i=0 ;i<studentData.length;i++){
        console.log(studentData[i],'------');
        
        const id=studentData[i].studentId
        const studentDetails:any=await Student.findById(id)
        
        students.push(studentDetails)
      }
      
        res.status(200).json({
          studentData,
          students
        })
    }else{
        return res.status(400).json({
            message:"no users Found"
        })
    }
} catch (error) {
    console.log(error)
}
}

const studentProfile = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    console.log("Request received for studentId:", studentId);

    const studentProfileDetails = await Student.findById(studentId).exec();
    if (studentProfileDetails) {
      res.status(200).json({
        studentProfileDetails,
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


const tutorLogout = async (req:Request, res:Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Tutor Logged Out" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





export {
  tutorRegistration,
  tutorLogin,
  verifyOtp,
  tutorResendOtp,
  tutorOtpExpiry,
  tutorForgotPassword,
  verifyForgotOTP,
  tutorNewPassword,
  tutorGoogleAuthentication,
  editProfile,
  tutorLogout,
  addCourses,
  getAlltutorCourse,
  editCourse,
  addNewLesson,
  editLesson,
  refreshTokenCreation,
  GetAllCategory,
  enrolledStudents,
  studentProfile
};
