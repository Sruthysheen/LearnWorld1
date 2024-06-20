import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentLogout } from '../../../Utils/config/axios.PostMethods';
import { logout } from '../../../Slices/studentSlice/studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function Navbar() {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { student } = useSelector((state: any) => state.student);

  useEffect(() => {
    const data = localStorage.getItem('Token');
    const isVerified = localStorage.getItem('isVerified');
    if (data && isVerified) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [student, isLogout]);

  const handleLogout = async () => {
    try {
      const response: any = await studentLogout();
      console.log(response, 'THIS IS RESPONSE');

      if (response.status === 200) {
        localStorage.removeItem('Token');
        localStorage.removeItem('isVerified');
        dispatch(logout());
        setIsLogout(!isLogout);
        navigate('/')
      } else {
        toast.error('Something went wrong..!');
      }
    } catch (error) {
      console.log('Logout error', error);
    }
  };

  const submitSearch = () => {
    navigate(`/getcourses?s=${searchQuery}`);
  };

 useEffect(()=>{
  const searchParams = new URLSearchParams(location.search);
    const searchQueryParam = searchParams.get("s");

    if (searchQueryParam) {
      setSearchQuery(searchQueryParam);
    }
 })

 const clearSearch = () => {
  navigate(location.pathname, { replace: true });
  setSearchQuery("");
};

  return (
    <>
       <nav className="border-t-4 bg-indigo-100">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between">
        <div className="flex space-x-7">
          <div>
            <a href="#" className="flex items-center py-4 px-2">
              <img
                src="/public/Logo.png"
                alt="Logo"
                className="rounded-full h-8 w-8 mr-2"
              />

                  <span className="font-semibold text-sky-800 text-2xl">
                    LearnWorld
                  </span>
                </a>
              </div>
            </div>
              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-sky-500 bg-white"
              />
               {searchQuery && (
              <button
                onClick={clearSearch}
                className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition duration-300"
              >
                &times;
              </button>
              
)}
 <button
                onClick={submitSearch}
                className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition duration-300"
              >
                Search
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="py-4 px-2 text-sky-800 font-semibold">
                Home
              </Link>
              <Link to="/getcourses" className="py-4 px-2 text-sky-800 font-semibold">
                Courses
              </Link>
              <Link to="/tutor/tutorregister" className="py-4 px-2 text-sky-800 font-semibold">
                For Instructor
              </Link>
             
              <div>
              <li className="font-sans block mt-4 lg:inline-block lg:mt-0 lg:ml-6 align-middle text-sky-800 hover:text-gray-700">
  <Link to="/cart" role="button" className="relative flex">
    <svg className="flex-1 w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
    </svg>
    {/* <span className="absolute right-0 top-0 rounded-full bg-sky-700 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center">
      5
    </span> */}
  </Link>
</li>

<li className="font-sans block mt-4 lg:inline-block lg:mt-0 lg:ml-6 align-middle text-sky-800 hover:text-gray-700">
  <Link to="/wishlist" role="button" className="relative flex">
    <svg className="flex-1 w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    {/* <span className="absolute right-0 top-0 rounded-full bg-sky-700 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm leading-tight text-center">
      5
    </span> */}
  </Link>
</li>



                </div>

               
              {loggedIn ? (<div className="flex items-center space-x-4">
                <div className="relative">
                  <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center focus:outline-none">
                    {student && student.photo ? (
                      <img src={student.photo} alt="Profile" className="h-8 w-8 rounded-full" />
                    ) : (
                      <img src="/public/Profile.jpg" alt="Profile" className="h-8 w-8 rounded-full" />
                    )}
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                      <Link to="/enrolled-course" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Enrolled Courses</Link>
                      <Link to="/tutor-list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tutors</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              </div>
            ) :(
              <>
              <Link
                to="/register"
                className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition duration-300"
              >
                SignUp
              </Link>
              <Link
                to="/login"
                className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition duration-300"
              >
                SignIn
              </Link>
              </>
              )}
               
            </div>
           
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
              Courses{' '}
            </a>
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              For Instructor{' '}
            </a>
            <a
              href=""
              className="cursor-pointer text-blue-500 block px-3 py-2 hover:text-blue-500 rounded-md text-base font-medium transition duration-300"
            >
              Blog{' '}
            </a>
            <Link
              to="/register"
              className="cursor-pointer bg-purple-600 text-white block px-3 py-2 hover:bg-purple-800 rounded-md text-base font-medium transition duration-300"
            >
              SignUp
            </Link>
            <a
              href="/login"
              className="cursor-pointer bg-purple-600 text-white block px-3 py-2 hover:bg-purple-800 rounded-md text-base font-medium transition duration-300"
            >
              SignIn
            </a>
          </div>
        )}
      </nav>
    </>
  );

}

export default Navbar;
