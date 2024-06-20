import React from 'react'; 
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminLoginPage from '../Pages/Admin/AdminLoginPage';
import AdminStudentPage from '../Pages/Admin/AdminStudentPage';
import AdminTutorPage from '../Pages/Admin/AdminTutorPage';
import AdminCategoryPage from '../Pages/Admin/AdminCategoryPage';
import AdminAddCategoryPage from '../Pages/Admin/AdminAddCategoryPage';
import AdminEditCategoryPage from '../Pages/Admin/AdminEditCategoryPage';
import AdminNavbar from '../Components/Admin/AdminDashboard/Header/AdminNavbar';
import AdminDashboardPage from '../Pages/Admin/AdminDashboardPage';
import AdminPrivateRoute from '../Components/PrivateRouter/AdminPrivateRouter';

const AdminRouter = () => {
    const location = useLocation();

   
    const showNavbar = location.pathname !== '/admin/adminlogin';

    return (
        <>
            {showNavbar && <AdminNavbar />}
            <Routes>
               
                <Route path="/adminlogin" element={<AdminLoginPage />} />
                <Route element={<AdminPrivateRoute isStudent={true} />}>
                <Route path="/admindashboard" element={<AdminDashboardPage />} />
                <Route path="/adminstudent" element={<AdminStudentPage />} />
                <Route path="/admintutor" element={<AdminTutorPage />} />
                <Route path="/admincategory" element={<AdminCategoryPage />} />
                <Route path="/adminaddcategory" element={<AdminAddCategoryPage />} />
                <Route path="/editcategory/:id" element={<AdminEditCategoryPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default AdminRouter;
