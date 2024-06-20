import React from 'react'; 
import { Route, Routes, useLocation } from 'react-router-dom';
import TutorRegisterPage from '../Pages/Tutor/TutorRegisterPage';
import OtpTutorPage from '../Pages/Tutor/OtpTutorPage';
import TutorLoginPage from "../Pages/Tutor/TutorLoginPage"
import TutorHomePage from '../Pages/Tutor/TutorHomePage';
import TutorForgotPasswordPage from '../Pages/Tutor/TutorForgotPasswordPage';
import TutorForgotOtpPage from '../Pages/Tutor/TutorForgotOtpPage';
import TutorNewPasswordPage from '../Pages/Tutor/TutorNewPasswordPage';
import TutorProfilePage from '../Pages/Tutor/TutorProfilePage';
import TutorNavbar from '../Components/Tutor/Header/TutorNavbar';
import TutorAddNewCoursePage from '../Pages/Tutor/TutorAddNewCoursePage';
import PrivatePage from '../Components/PrivateRouter/PrivatePage';
import MyCourseTutorPage from '../Pages/Tutor/MyCourseTutorPage';
import SingleCourseViewPage from '../Pages/Tutor/SingleCourseViewPage';
import EditCoursePage from '../Pages/Tutor/EditCoursePage';
import AddLessonPage from '../Pages/Tutor/AddLessonPage';
import Footer from '../Components/Student/Home/Footer';
import EditLessonPage from '../Pages/Tutor/EditLessonPage';
import StudentsPage from '../Pages/Tutor/StudentsPage';
import ChatPage from '../Pages/Student/ChatPage';

const TutorRouter = () => {
    const location = useLocation();
    const showNavbar = !['/tutor/tutorlogin', '/tutor/tutorregister', '/tutor/home'].includes(location.pathname);  
    const showFooter = !['/tutor/tutorlogin', '/tutor/tutorregister', '/tutor/home'].includes(location.pathname);
    return (
        <>
            {showNavbar && <TutorNavbar />}
            <Routes>
                <Route path="/tutorregister" element={<TutorRegisterPage/>} />
                <Route path="/tutorotp" element={<OtpTutorPage/>} />
                <Route path="/tutorlogin" element={<TutorLoginPage />} />
                <Route path="/tutorforgotpassword" element={<TutorForgotPasswordPage/>} />
                <Route path="/verifyforgototptutor" element={<TutorForgotOtpPage/>} />
                <Route path="/tutornewpassword" element={<TutorNewPasswordPage/>} />
                
                <Route element={<PrivatePage isStudent={false} />}> 
                    <Route path="/home" element={<TutorHomePage/>} />
                    <Route path="/tutorprofile" element={<TutorProfilePage/>} />
                    <Route path="/addnewcourse" element={<TutorAddNewCoursePage/>} />
                    <Route path="/getallcourse" element={<MyCourseTutorPage/>} /> 
                    <Route path="/viewcourse" element={<SingleCourseViewPage/>} />
                    <Route path="/editcourse" element={<EditCoursePage/>} />
                    <Route path="/addlesson" element={<AddLessonPage/>} />
                    <Route path="/editlesson/:lessonId" element={<EditLessonPage/>} />
                    <Route path="/enrolled-students" element={<StudentsPage/>} />
                    <Route path="/chat-box/:chatId" element={<ChatPage  />} />
                </Route>
            </Routes> 
            {showFooter && <Footer />}
        </>
    )
}

export default TutorRouter;
