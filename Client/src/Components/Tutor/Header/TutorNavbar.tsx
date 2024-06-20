import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tutorLogout } from '../../../Utils/config/axios.PostMethods';
import { tutorlogout } from '../../../Slices/tutorSlice/tutorSlice';

function TutorNavbar() {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const { tutor } = useSelector((state: any) => state.tutor);
  useEffect(() => {
    const data = localStorage.getItem("Token");
    console.log(data)
    if (data) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [tutor]);

  const handleLogout = async () => {
    try {
      await tutorLogout();
      localStorage.removeItem("Token");
      dispatch(tutorlogout());
      navigate("/", { replace: true });
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  return (
 
<>
  <nav className="border-t-4 bg-indigo-200">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between">
        <div className="flex space-x-7">
          <div>
            <a href="#" className="flex items-center py-4 px-2">
              <img src="/public/Logo.png" alt="Logo" className="rounded-full h-8 w-8 mr-2" />
              <span className="font-semibold text-sky-800 text-2xl">LearnWorld</span>
            </a>
          </div>
        </div>
        {/* Other navigation items */}
        
        <div className="hidden md:flex items-center space-x-4">
        <Link to="/tutor/home" className="py-4 px-2 text-sky-800 font-semibold">
               Home
              </Link>
              <Link to="/tutor/enrolled-students" className="py-4 px-2 text-sky-800 font-semibold">
               Students
              </Link>
              <Link to="/tutor/getallcourse" className="py-4 px-2 text-sky-800 font-semibold">
                My Course
              </Link>
              <div className="relative">
                <button onClick={() => setShowCourseDropdown(!showCourseDropdown)} className="py-4 px-2 text-sky-800 font-semibold focus:outline-none">
                  Course
                </button>
                {showCourseDropdown && (
                  <div className="absolute mt-2 w-40 bg-indigo-200 border border-gray-300 rounded-md shadow-lg z-10">
                    <Link to="/tutor/addnewcourse" className="block px-4 py-2 text-sm text-sky-800 hover:bg-gray-100">Add Course</Link>
                    <Link to="/tutor/addlesson" className="block px-4 py-2 text-sm text-sky-800 hover:bg-gray-100">Add Lesson</Link>
                  </div>
                )}
              </div>
              </div>
        
        {/* Profile Image and Dropdown */}
        {loggedIn && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center focus:outline-none">
                    {tutor && tutor.photo ? (
                      <img src={tutor.photo} alt="Profile" className="h-8 w-8 rounded-full" />
                    ) : (
                      <img src="/public/Profile.jpg" alt="Profile" className="h-8 w-8 rounded-full" />
                    )}
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                      <Link to="/tutor/tutorprofile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              </div>
            )}

        
        
        {/* Responsive Toggle */}
        <div className="mr-10 flex md:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center justify-center p-2 rounded-md text-dark"
          >

              <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"></path>
                </svg>

          </button>
        </div>
      </div>
    </div>
    
    {/* Mobile menu */}
    {showMenu && (
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 md:hidden">
        {/* Mobile links */}
        <Link
              to=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Students{' '}
            </Link>
            <Link
              to=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              My Course{' '}
            </Link>
            <Link
              to=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Course{' '}
            </Link>
           
      </div>
    )}
  </nav>
</>

  
  );
}

export default TutorNavbar;
