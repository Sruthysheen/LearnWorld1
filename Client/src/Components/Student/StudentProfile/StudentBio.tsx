import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { register } from "../../../Slices/studentSlice/studentSlice";
import { Link } from "react-router-dom";


function StudentBio() {
    const {student} = useSelector((state:any)=>state.student);
    const studentId= student._id;
    console.log(studentId);
  
    
  return (
    <div className="flex items-center h-screen w-full justify-center">
    <div className="w-full max-w-xl">
      {/* Card container */}
      <div className="bg-white shadow-xl rounded-lg py-6">
        {/* Profile picture */}
        <div className="photo-wrapper p-4">
          <img
            className="w-32 h-32 rounded-full mx-auto"
            src={student.photo}
            alt="Profile Image"
          />
        </div>
        {/* Profile details */}
        <div className="p-4">
          <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
            {student.studentname}
          </h3>
          {/* Table for contact information */}
          <table className="text-lg my-3 mx-auto">
            <tbody>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">Email:</td>
                <td className="px-2 py-2">{student.studentemail}</td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">Phone:</td>
                <td className="px-2 py-2">{student.phone}</td>
              </tr>
            </tbody>
          </table>
          {/* Edit profile link */}
          <div className="text-center my-3">
            <Link
              className="text-md text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
              to="/editprofile"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default StudentBio;
