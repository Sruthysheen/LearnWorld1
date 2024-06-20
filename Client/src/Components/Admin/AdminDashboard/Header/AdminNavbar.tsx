import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../Slices/adminSlice/adminSlice';
import { adminLogout } from '../../../../Utils/config/axios.PostMethods';



function AdminNavbar() {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { admin } = useSelector((state: any) => state.admin);


  useEffect(() => {
    const data = localStorage.getItem("Token");
    if (data) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [admin]);


  const handleLogout = async () => {
    try {
      await adminLogout();
      localStorage.removeItem("Token");
      dispatch(logout());
      navigate("/admin/adminlogin", { replace: true });
    } catch (error) {
      console.log("Logout error", error);
    }
  };



  

  return (
    <>
    <>
  {/* component */}
  <nav className="border-t-4 bg-indigo-100">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between ">
        <div className="flex space-x-7">
          <div className='flex justify-start items-center'>
          
              <img
                src="/public/Logo.png"
                alt="Logo"
                className="rounded-full h-8 w-8 mr-2"
              />
              <span className="font-semibold text-sky-800 text-2xl">
                LearnWorld
              </span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/admin/admindashboard" className="py-4 px-2 text-sky-800 font-semibold">
            Home
          </Link>
          <Link to="/admin/admincategory" className="py-4 px-2 text-sky-800 font-semibold">
            Category
          </Link>
          <Link to="/admin/adminstudent" className="py-4 px-2 text-sky-800 font-semibold">
            Students
          </Link>
          <Link to="/admin/admintutor" className="py-4 px-2 text-sky-800 font-semibold">
            Tutors
          </Link>
         
          {loggedIn && (
                <button
                  onClick={handleLogout}
                  className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition duration-300"
                >
                  Logout
                </button>)}
          
        </div>
        
        <div className="mr-10 flex md:hidden">
          <button  onClick={() => setShowMenu(!showMenu)} 
          className="inline-flex items-center justify-center p-2 rounded-md text-dark">
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
    {showMenu && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 md:hidden">
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Home{' '}
            </a>
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Category{' '}
            </a>
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Students{' '}
            </a>
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Tutors{' '}
            </a>
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Blog{' '}
            </a>
           
          </div>
        )}
  </nav>
</>

    </>
  )
}

export default AdminNavbar