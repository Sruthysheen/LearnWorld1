import { Request, Response } from "express";
import Admin from "../../models/adminModel";
import {generateAccessToken,generateRefreshToken} from "../../Utlitis/generateToken";
import Student from "../../models/studentModel";
import Tutor from "../../models/tutorModel";
import Category from "../../models/categoryModel";
import jwt from "jsonwebtoken";





const loginAdmin = async (req: Request, res: Response) => {
    try {
      const { adminemail, password } = req.body;
  
      // Assuming you have a MongoDB collection called "admins"
      const admin = await Admin.findOne({ adminemail });
  
      if (admin && admin.password === password) {
        const idString = admin._id.toString();
        const accessToken = generateAccessToken(idString); 
        const refreshToken = generateRefreshToken(idString)
        req.session.accessToken = accessToken;
        return res.status(200).json({
          id: idString,
          adminemail,
          token:refreshToken,
        });
      } else {
        return res.status(401).json({ message: "Invalid Email or password" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
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








  const logoutAdmin = async (req: Request, res: Response) => {
    res.cookie("jwtAdmin", "", {
      httpOnly: true,
      expires: new Date(),
    });
    res.status(200).json({ message: "Admin Logged Out" });
  };
  


  const listAllStudents = async (req: Request, res: Response) => {
    try {
      console.log("headers",req.headers);
      
      const studentDetails = await Student.find().exec();
      if (studentDetails) {
        res.status(200).json({
          studentDetails,
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




  const blockStudent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id, "id");
      const user = await Student.findById(id);
      console.log(user, "user");
  
      if (!user) {
        return res.status(400).json({ message: "User not Found" });
      }
  
      user.isBlocked = true;
  
      await user.save();
  
      return res.status(200).json({ message: "User Blocked Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  


  const unblockStudent =async(req:Request,res:Response)=>{
    try {
        const {id} =req.params;
  
        const user =await Student.findById(id)
  
        if(!user){
            return res.status(400).json({message:"User not Found"})
        }
  
        user.isBlocked =false;
  
        await user.save();
  
        return res.status(200).json({message:"User UnBlocked SuccessFully"})
  
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Server Error"})
        
    }
  }


  const listAllTutors = async (req: Request, res: Response) => {
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



  const blockTutor = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id, "id");
      const tutor = await Tutor.findById(id);
      console.log(tutor, "tutor");
  
      if (!tutor) {
        return res.status(400).json({ message: "Tutor not Found" });
      }
  
      tutor.isBlocked = true;
  
      await tutor.save();
  
      return res.status(200).json({ message: "Tutor Blocked Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  


  const unblockTutor =async(req:Request,res:Response)=>{
    try {
        const {id} =req.params;
  
        const tutor =await Tutor.findById(id)
  
        if(!tutor){
            return res.status(400).json({message:"Tutor not Found"})
        }
  
        tutor.isBlocked =false;
  
        await tutor.save();
  
        return res.status(200).json({message:"Tutor UnBlocked SuccessFully"})
  
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Server Error"})
        
    }
  }




  const addAdminCategory = async(req:Request, res:Response) =>{
    try {
      const {categoryname,description } = req.body;

      console.log(req.body);
      
      const categoryExist = await Category.findOne({
        categoryname: { $regex: new RegExp(`^${categoryname}$`, 'i') }
      });
      console.log(categoryExist);
      
      if (categoryExist) {
        return res.json({status:false,message:"Category already exists" });
    }
    
      const newCategory = await Category.create({
        categoryname:categoryname,
        description:description
      })

      if(newCategory){
        return res.status(200).json({
          status:true,
          categoryname,
          description,
          message:"Category added successfully"})
      } else {
        return res.json({status:false,message:"Invalid category data"})
      }
    } catch (error) {
      res.json({status:false, message: "Server error" });
    }
  }

  const listAllCategory = async (req: Request, res: Response) => {
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
  

  // const listAllCategoryForView = async (req: Request, res: Response) => {
  //   try {
  //     const categoryDetails = await Category.find({ isDeleted: false }).exec();
  
  //     if (categoryDetails) {
  //       return res.status(200).json({
  //         data: categoryDetails 
  //       });
  //     } else {
  //       return res.status(400).json({ message: "Category does not exist" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // };



  const getCategoryById = async(req:Request, res:Response)=>{
    const id = req.params.id;
    try {
      const categoryDetails = await Category.findById(id).exec()
      if(categoryDetails){
        return res.status(200).json({categoryDetails,message:"Category found successfully"});
      } else {
        return res.status(400).json({massage:"message not found"});
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

  }



  const editCategory = async (req:Request, res:Response) => {
    try {
console.log(req.body);

      
      const { categoryname, description,id } = req.body;
  
      const category = await Category.findById(id);
      console.log(category,"----------------------");
      

      if (!category) {
        return res.status(400).json({ error: "Invalid category" });
      }

      if (category.categoryname !== categoryname) {
        const existingCategory = await Category.findOne({
          categoryname: { $regex: new RegExp(`^${categoryname}$`, 'i') },
          _id: { $ne: id }
        });
  
        if (existingCategory) {
          return res.status(400).json({message: "Category with the same name already exists" });
        }
      }
  
      category.categoryname = categoryname;
      category.description = description;
    
      const updatedCategory = await category.save(); 
      console.log(updatedCategory,".....................");
      
  
      if (updatedCategory) {
        return res.status(200).json({ message: "Category updated successfully" });
      } else {
        return res.status(400).json({ error: "Failed to update category" });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


  const deleteCategory = async (req: Request, res: Response) => {
    console.log("deletye Category");
    try {
      const { id } = req.params;
      const item: any = await Category.findOne({ _id: id });
  
      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
  
      if (item && "isDeleted" in item) {
        item.isDeleted = true;
        const updatedItem = await item.save();
  
        if (updatedItem) {
          res
            .status(200)
            .json({ success: true, message: "Category Deleted Successfully" });
        } else {
          res
            .status(500)
            .json({ success: false, message: "Category deletion failed" });
        }
      } else {
        res
          .status(500)
          .json({
            success: false,
            message: "Category deletion failed - Property not found",
          });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };



  
  


    
    

  

  export {loginAdmin,
          logoutAdmin,
          listAllStudents,
          blockStudent,
          unblockStudent,
          listAllTutors,
          blockTutor,
          unblockTutor,
          addAdminCategory,
          listAllCategory,
          getCategoryById,
          editCategory,
          deleteCategory,
          refreshTokenCreation
          
          
        }