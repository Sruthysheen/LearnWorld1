import express from "express";
const adminRouter = express.Router();
import {addAdminCategory, blockStudent, blockTutor, deleteCategory, editCategory, getCategoryById, listAllCategory, listAllStudents, listAllTutors, loginAdmin, logoutAdmin, refreshTokenCreation, unblockStudent, unblockTutor} from "../../controller/adminController/adminController";
import { isAdmin } from "../../middleware/adminMiddleware";

adminRouter.post('/adminlogin',loginAdmin);
adminRouter.get('/adminstudent',isAdmin,listAllStudents)
adminRouter.put('/blockstudent/:id',isAdmin, blockStudent)
adminRouter.put('/unblockstudent/:id',isAdmin, unblockStudent)
adminRouter.get('/admintutor',isAdmin,listAllTutors)
adminRouter.put('/blocktutor/:id',isAdmin,blockTutor)
adminRouter.put('/unblocktutor/:id',isAdmin,unblockTutor)
adminRouter.post('/adminaddcategory',isAdmin,addAdminCategory)
adminRouter.get('/admincategory',isAdmin,listAllCategory)
adminRouter.get('/getcategoryid/:id',isAdmin, getCategoryById)
adminRouter.post('/editcategory',isAdmin,editCategory)
adminRouter.delete('/deletecategory/:id',isAdmin,deleteCategory)
adminRouter.post('/adminlogout',logoutAdmin)
adminRouter.post('/refresh',refreshTokenCreation)


export {adminRouter};