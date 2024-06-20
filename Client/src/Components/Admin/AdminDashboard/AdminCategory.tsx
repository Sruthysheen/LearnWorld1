import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "sonner";
import { adminListCategory } from "../../../Utils/config/axios.GetMethods";
import { deleteCategory } from "../../../Utils/config/axios.DeleteMethod";

function AdminCategory() {

    const navigate = useNavigate();
    
  
    const [data, setData]: any = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;
    
    const totalPages = Math.ceil(data.length / dataPerPage);
    const paginateddata = data.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);


  
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
      const fetchData = async () => {
        try {
          const result: any = await adminListCategory();
          const validCategories = result.data.categoryDetails.filter((category: any) => !category.isDeleted);
          setData(validCategories);
        } catch (error) {
          console.error("Error during admin get all tutors:", error);
        }
      };
      fetchData();
    }, [adminListCategory]); 
    
 

  const handleDeleteCategory = async (_id: any) => {
    console.log("Deleting category with id:", _id);
    try {
        const res: any = await deleteCategory(_id);
        console.log("Delete response:", res);

        if (res.status === 200) {
            const updatedCategories = data.filter((category: any) => category._id !== _id);
            setData(updatedCategories);

            toast.success(res.data.message);
        } else {
            toast.error(res.response.data.error);
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
    }
};

const handleEditCategory=(id:string)=>{
  navigate(`/admin/editcategory/${id}`)
}



  return (
    <>
    <div className="w-full h-full  px-20  py-11  bg-white">

     
<table className="border-collapse w-full ">
  <thead>
    <tr>
      <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
        Category name
      </th>
      <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
        Description
      </th>
      <th className="p-3 font-bold uppercase bg-sky-200 text-sky-800 border border-blue-300 hidden lg:table-cell">
        Actions      
      </th>
    </tr>
  </thead>
  <tbody>
  {paginateddata
                .filter((category: any) => !category.isDeleted)
                .map((category: any, index: any) => (
                  <tr key={index}>

        <td className="w-full lg:w-auto p-3 text-sky-800 text-center border border-b block lg:table-cell relative lg:static">
          {category.categoryname}
        </td>
        <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-center block lg:table-cell relative lg:static">
          {category.description}
        </td>
        <td className="w-full lg:w-auto p-3 text-sky-800 border border-b text-center block lg:table-cell relative lg:static">
  <button
    onClick={()=>handleEditCategory(category._id)}
    className="bg-sky-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2"
  >
    Edit
  </button>
  <button
    onClick={() => handleDeleteCategory(category._id)}
    className="bg-red-400 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
  >
    Delete
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
<div className="flex justify-end mt-5">
    <a href="/admin/adminaddcategory" className="px-5 py-3 bg-sky-600 text-white text-sm uppercase font-medium rounded mr-2">
        <button>
            Add Category
        </button>
    </a>
</div>


</div>
    </>
  )
}

export default AdminCategory 