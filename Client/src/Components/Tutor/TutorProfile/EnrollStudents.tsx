import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { enrolledStudents } from "../../../Utils/config/axios.GetMethods";

interface studentDetails {
    studentId: any;
    createdAt: string | number | Date;
    _id: any;
    studentname: string;
    studentemail: string;
    phone: string;
    userId: string;
    photo: any;
    courseId: any;
    amount: string;
  }

function EnrollStudents() {

    const [userDetails, setUserDetails] = useState<studentDetails[]>([]);
  const [studentsDetails, setStudentDetails] = useState<studentDetails[]>([]);
  const combinedDetails = [...userDetails, ...studentsDetails];

  const {tutor} = useSelector((state:any)=>state.tutor)
  const tutorId = tutor._id;

  useEffect(()=>{
    const fetchStudents = async()=>{
        try {
            const response = await enrolledStudents(tutorId);
            if(response.data.studentData){
                console.log(response.data.studentData, "enrolled students");
              
                setUserDetails(response.data.studentData);
                setStudentDetails(response.data.students)
                console.log(response.data.students,"studentsss");
            }
            else {
                toast.error("No users found");
              }
        } catch (error) {
            toast.error("Error fetching data");
        }
    }
    fetchStudents();
  },[])

  return (
    <div>
  <div className="p-6 ">
    {userDetails.length > 0 ? (
      <table className="mx-auto table-auto">
        <thead>
          <tr className="bg-sky-500">
            <th className="px-16 py-2">
              <span className="text-white font-semibold">No</span>
              
            </th>
            <th className="px-16 py-2">
              <span className="text-white font-semibold">Student Name</span>
            </th>
            <th className="px-16 py-2">
              <span className="text-white font-semibold">CourseName</span>
            </th>
            <th className="px-16 py-2">
              <span className="text-white font-semibold">Fee</span>
            </th>
            <th className="px-16 py-2">
              <span className="text-white font-semibold">Enrolled Date</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-200">
          {userDetails.map((course, index) => (
            <tr className="bg-white border-b-2 border-gray-200" key={course._id}>
              <td>
                <span className="text-center ml-16 font-semibold text-sky-700">
                  {index + 1}
                </span>
                
              </td>
              <td className="px-2 py-2">
                <span className="text-center ml-8 text-sky-700">
                {`${course.studentId.studentname}`}
                </span>
              </td>
              <td className="px-16 py-2 text-sky-700">
                <span>{course.courseId.courseName}</span>
              </td>
              <td className="px-16 py-2 text-sky-700">
                <span>{course.amount}</span>
              </td>
              <td className="px-16 py-2 text-sky-700">
                {new Date(course.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center py-8">
        <span className="text-xl text-gray-700">No enrolled students found.</span>
      </div>
    )}

<div className="flex-1 flex justify-end items-center relative">
    <Link
      to="/tutor/chat-box/index"
      className="z-20 text-white flex flex-col shrink-0 grow-0 justify-around 
          fixed bottom-0  right-5 rounded-lg
          mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10"
    >
      <div className="p-3 rounded-full border-4 border-white bg-green-600">
        <svg
          className="w-10 h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  </div>
  </div>
</div>

  )
}

export default EnrollStudents