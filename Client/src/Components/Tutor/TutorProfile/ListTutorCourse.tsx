import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../../Utils/config/axios.config";
import { tutorregister} from "../../../Slices/tutorSlice/tutorSlice";
import { tutorlogin} from "../../../Slices/tutorSlice/tutorSlice";
import { toast } from "sonner";
import { getAllCourses } from "../../../Utils/config/axios.GetMethods";
import { useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {clearCourseDetails,setSingleCourseDetails} from "../../../Slices/tutorSlice/courseSlice";
import LoadingSpinner from "../../Common/LoadingSpinner";

interface Course {
  _id: string;
  courseName: string;
  courseDuration: string;
  courseDescription: string;
  category: string;
  courseFee: number;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

function ListTutorCourse() {

  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courseInfos, setCourseInfos] = useState<Course[]>([]);

  const {tutor} = useSelector((state: any)=>state.tutor);

  console.log(tutor, "..............................");

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 8;
    
    const totalPages = Math.ceil(courseInfos.length / dataPerPage);
    const paginateddata = courseInfos.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    const handlePrev = () => {
      if (currentPage !== 1) {
        setCurrentPage((prev) => prev - 1);
      }
    };
  
    const handleNext = () => {
      if (currentPage !== totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    };
  
 
  
  useEffect(() => {
  const fetchBio = async () => { 
    try {
      console.log(tutor._id,'111111111111111111');
      
      const response: any = await getAllCourses(tutor._id);
      console.log(response.data,"this is courses");
      
      if (response?.data) {
        const data=response.data.courseDetails
        setCourseInfos(data);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again later.");
    } finally {
      setLoading(false); 
    }
  };
    fetchBio();
  },[]);


  const handleReadMore = (item: any) => {
    dispatch(clearCourseDetails());
    dispatch(setSingleCourseDetails(item));
  };

  return (
    <>
     {loading ? (
        <LoadingSpinner /> ): courseInfos && courseInfos.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 mx-10 gap-4">
    {paginateddata.map((course, index) => (
     <div key={index} className="mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-3/4 mx-auto">

        <Link to="#">
          <img
            className="rounded-t-lg w-full h-40 object-cover"
            src={course?.photo}
            alt={course?.courseName} 
          />
        </Link>
        <div className="p-5">
          <Link to="#">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-sky-700 dark:text-white">
              {course?.courseName}
            </h5>
          </Link>
          <h3 className="mb-3 font-normal text-sky-600 dark:text-gray-400">
            ₹{course.courseFee}
          </h3>
          <div className="text-start">
          <Link
            to="/tutor/viewcourse"
            onClick={()=>handleReadMore(course)}
            className="inline-flex items-center px-6 py-1 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            View Course
          </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
  
) : (
  <div className="text-center py-8">
    <span className="text-xl text-gray-700">No course available.</span>
  </div>
)}
<div className="mt-28">
<ul className="flex space-x-3 justify-center mt-8">
  <li
    onClick={handlePrev}
    className={`flex items-center justify-center shrink-0 cursor-pointer ${
      currentPage === 1 ? "bg-gray-300" : ""
    } w-9 h-8 rounded`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 fill-gray-500"
      viewBox="0 0 55.753 55.753"
    >
      <path
        d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
        data-original="#000000"
      />
    </svg>
  </li>
  {Array.from({ length: totalPages }, (_, i) => (
    <li
      key={i}
      onClick={() => handlePageChange(i + 1)}
      className={`flex items-center justify-center shrink-0 cursor-pointer text-sm font-bold ${
        currentPage === i + 1 ? "bg-sky-600 text-white" : "text-[#333] bg-gray-300"
      } w-9 h-8 rounded`}
    >
      {i + 1}
    </li>
  ))}
  <li
    onClick={handleNext}
    className={`flex items-center justify-center shrink-0 cursor-pointer ${
      currentPage === totalPages ? "bg-gray-300" : ""
    } w-9 h-8 rounded`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 fill-gray-500 rotate-180"
      viewBox="0 0 55.753 55.753"
    >
      <path
        d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
        data-original="#000000"
      />
    </svg>
  </li>
</ul>
</div>
    </>
  );
}

export default ListTutorCourse;
