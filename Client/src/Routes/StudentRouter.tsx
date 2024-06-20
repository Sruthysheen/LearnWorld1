import React from 'react'; 
import { Route, Routes, useLocation  } from 'react-router-dom';
import LoginPage from "../Pages/Student/LoginPage";
import RegisterPage from '../Pages/Student/RegisterPage';
import OtpStudentPage from '../Pages/Student/OtpStudentPage';
import ForgotPasswordPage from '../Pages/Student/ForgotPasswordPage';
import ForgotOtpPage from '../Pages/Student/ForgotOtpPage';
import NewPasswordPage from '../Pages/Student/NewPasswordPage';
import HomePage from '../Pages/Student/HomePage';
import PrivatePage from '../Components/PrivateRouter/PrivatePage';
import CourseViewPage from '../Pages/Student/CourseViewPage';
import Navbar from '../Components/Student/Header/Navbar';
import Footer from '../Components/Student/Home/Footer';
import StudentSingleCourseViewPage from '../Pages/Student/StudentSingleCourseViewPage';
import CartPage from '../Pages/Student/CartPage';
import WishlistPage from '../Pages/Student/WishlistPage';
import StudentProfilePage from '../Pages/Student/StudentProfilePage';
import EditProfilePage from '../Pages/Student/EditProfilePage';
import PaymentSuccessPage from '../Pages/Student/PaymentSuccessPage';
import EnrolledCoursePage from '../Pages/Student/EnrolledCoursePage';
import SingleEnrolledCourse from '../Components/Student/EnrolledCourse/SingleEnrolledCourse';
import SingleEnrolledCoursePage from '../Pages/Student/SingleEnrolledCoursePage';
import StudentChatPage from '../Pages/Student/StudentChatPage';
import TutorPage from '../Pages/Student/TutorPage';


const StudentRouter = () => {
  const location = useLocation();
  const showNavbar = !['/login','/register','/otp','/'].includes(location.pathname);
  const showFooter = !['/login','/register','/otp','/'].includes(location.pathname);
  return (
    <>
     {showNavbar && <Navbar/>} 
      <Routes>
        
       
        <Route path="/login" element={<LoginPage />} />
        <Route path = "/register" element = {<RegisterPage/>} />
        <Route path = "/otp" element = {<OtpStudentPage/>} />
        <Route path = "/forgotpassword" element = {<ForgotPasswordPage/>} />
        <Route path = "/forgototp" element = {<ForgotOtpPage/>} />
        <Route path = "/newpassword" element = {<NewPasswordPage/>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/getcourses?s" element={<CourseViewPage/>} />


        <Route element={<PrivatePage isStudent={true} />}>
        
        
        <Route path="/singlecourse" element={<StudentSingleCourseViewPage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/wishlist" element={<WishlistPage/>} />
        <Route path="/profile" element={<StudentProfilePage/>} />
        <Route path="/editprofile" element={<EditProfilePage/>} />
        <Route path="/paymentsuccess" element={<PaymentSuccessPage/>} />
        <Route path="/enrolled-course" element={<EnrolledCoursePage/>} />
        <Route path="/tutor-list" element={<TutorPage/>} />
        <Route path="/enrolled-singlecourse" element={<SingleEnrolledCoursePage/>} />
        <Route path="/student-chat/:tutorId/:chatId" element={<StudentChatPage/>} />
        



        </Route>

      </Routes>
      {showFooter && <Footer/>}
    </>
  );
};

export default StudentRouter;
