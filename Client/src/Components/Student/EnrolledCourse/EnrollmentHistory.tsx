import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { enrolledCourse } from "../../../Utils/config/axios.GetMethods";
import LoadingSpinner from "../../Common/LoadingSpinner";

interface Course {
  courseId: {
    _id: string;
    courseName: string;
    courseDescription: string;
    photo: string[];
    courseFee: number;
    courseDuration: string;
    category: string;
  };
  tutorId: {
    _id: string;
    tutorname: string;
    tutoremail: string;
    phone: string;
    photo:string;
  };
  amount: number;
  createdAt: string;
  paymentMethod: string;
  status: string;
}
function EnrollmentHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {student} = useSelector((state:any)=>state.student);
  const studentId = student._id;
  const[enrolledCourses,setEnrolledCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 6;
  const totalPages = Math.ceil(enrolledCourses.length / dataPerPage);
  const paginatedData = enrolledCourses.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
 

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await enrolledCourse(studentId);
            if (response) {
                setEnrolledCourses(response.data);
            }
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
            toast.error("Failed to fetch enrolled courses");
        } finally {
            setLoading(false);
        }
    };
    if (studentId) {
        fetchEnrolledCourses();
    }
}, [studentId]);



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


  return (
    <>
    {loading && <LoadingSpinner/>}
      <div className="w-full h-full px-20 py-11 bg-white">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="p-3 font-medium uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
                Course
              </th>
              <th className="p-3 font-medium uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
                Amount
              </th>
              <th className="p-3 font-medium uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
                Tutor
              </th>
              <th className="p-3 font-medium uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
                Enroll Date
              </th>
              <th className="p-3 font-medium uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
                Payment
              </th>
            
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.map((course,index)=>(
            <tr key={index}>
              <td className="w-full lg:w-auto p-3 text-sky-800 text-center border border-b block lg:table-cell relative lg:static">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src={course.courseId.photo[0]} 
                          alt={course.courseId.courseName}
                        />
                      </div>
                      <span>{course.courseId.courseName}</span>
                    </div>
                  </td>
                  <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-left block lg:table-cell relative lg:static">
                  ₹{course.amount}
              </td>
              
              <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-center block lg:table-cell relative lg:static">
              {/* {course?.tutorId.tutorname} */}
              <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src={course.tutorId.photo} 
                          alt={course.tutorId.tutorname}
                        />
                      </div>
                      <span>{course.tutorId.tutorname}</span>
                    </div>
             
              </td>
              <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-left block lg:table-cell relative lg:static">
              {new Date(course?.createdAt).toLocaleDateString()}
              </td>
              <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-left block lg:table-cell relative lg:static">
                {course.paymentMethod}
              </td>
              
            </tr>
            ))}
          </tbody>
          
        </table>

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

export default EnrollmentHistory