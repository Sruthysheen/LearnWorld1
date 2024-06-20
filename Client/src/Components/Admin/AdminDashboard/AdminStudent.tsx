import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { adminListAllStudents } from "../../../Utils/config/axios.GetMethods";
import { adminBlockStudent, adminUnblockStudent } from "../../../Utils/config/axios.PutMethod";

function AdminStudent() {
  interface User {
    _id: any;
    studentname: string;
    studentemail: string;
    phone: string;
    password: string;
    isBlocked: boolean;
  }

  const [data, setData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await adminListAllStudents();
        setData(result.data.studentDetails);
      } catch (error) {
        console.error("Error during admin get all students:", error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / dataPerPage);
  const paginatedData = data.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

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

  const userStatus = async (user: User) => {
    console.log("Button Clicked");
    try {
      const updatedStatus = !user.isBlocked;
      await (updatedStatus ? adminBlockStudent(user._id) : adminUnblockStudent(user._id));

      user.isBlocked = updatedStatus;
      toast.success(`User ${updatedStatus ? "Blocked" : "Unblocked"} Successfully`, {
        style: { background: updatedStatus ? "#171616" : "#f7f3f2", color: updatedStatus ? "white" : "black" },
      });

      localStorage.setItem(`user_${user._id}_status`, updatedStatus ? "Blocked" : "Unblocked");

      setData([...data]);
    } catch (error) {
      console.error("Error in userStatus:", error);
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <>
     
      <div className="w-full h-full  px-20  py-11  bg-white">

     
      <table className="border-collapse w-full ">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
              Student name
            </th>
            <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
              Student email
            </th>
            <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
              Phone Number
            </th>

            <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((user) => (
            <tr
              key={user._id}
              className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
            >
              <td className="w-full lg:w-auto p-3 text-sky-800 text-center border border-b block lg:table-cell relative lg:static">
                {user.studentname}
              </td>
              <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-center block lg:table-cell relative lg:static">
                {user.studentemail}
              </td>
              <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-center block lg:table-cell relative lg:static">
                {user.phone}
              </td>
              <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-center block lg:table-cell relative lg:static">
                <button
                  onClick={() => userStatus(user)}
                  className="bg-sky-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
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

export default AdminStudent;
