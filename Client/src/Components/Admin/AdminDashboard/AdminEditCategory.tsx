import React, { useState, useEffect } from "react";
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CategoryInfo, CategoryValidation } from "../../../Utils/Validation/addCategoryValidation";
import { AdminCategoryData } from "../../../Utils/api/types";
import { editCategory } from "../../../Utils/config/axios.PostMethods";
import { getCategory } from "../../../Utils/config/axios.GetMethods";
import { string } from "zod";


function AdminEditCategory() {
  interface Category {
    _id: string;
    categoryname: string;
    description: string;
   
    }
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {errors, handleSubmit, register, reset} = CategoryValidation();
  const [categoryDetails, setCategoryDetails] = useState<any>({
    categoryname: "",
    description:""
  });

  useEffect(()=>{
console.log(id,'THIS IS ID');

  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response:any = await getCategory(id);
        console.log(response.data,"---------------------");
        
        setCategoryDetails({
          categoryname: response.data.categoryDetails.categoryname,
          description: response.data.categoryDetails.description
        });
      } catch (error) {
        toast.error("Failed to fetch category details");
      }
    };

    fetchData();
  }, [id]);


  const handleEditCategory = async (e:any) => {
    try {
      e.preventDefault()
      if (id === undefined) {
        return;
      }  
      const response: any = await editCategory(categoryDetails, id);
      console.log(response,'THIS IS RESPOCE FORM CHANGES CATEGORy');
      
      if (response.status == 200) {
        // setCategoryDetails(response.data.categoryDetails)
        toast.success(response.data.message);
        navigate("/admin/admincategory");
        
      } 
      else {
        const errorMessage = response?.data?.message || 'An error occurred';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      toast.error(errorMessage);
    }
  };
  
  return (
    <>
    
  {/* component */}
  <div className="w-full bg-gray-300 h-screen">
    <div className="bg-gradient-to-b from-blue-50 to-blue-300 h-80" />
    <div className="max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 mb-12">
      <div className="bg-sky-700 w-full shadow rounded p-8 sm:p-12 -mt-72">
        <p className="text-3xl font-bold leading-7 text-center text-white">
         Edit Category
        </p>
        <form >
          <div className="md:flex items-center mt-12">
            <div className="w-full md:w-1/2 flex flex-col">
             
              
              <div className="flex flex-col mt-4">

             <label className="font-semibold leading-none text-white">
            Category Name
          </label>
          
              <input
                type="text"
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border-0 bg-white rounded"
                value={categoryDetails.categoryname}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, categoryname: e.target.value })}
              />
            </div>
            </div>
          </div>
          <div>
            <div className="w-full flex flex-col mt-8">
             

              <div className="flex flex-col mt-4">

            
                <label className="font-semibold leading-none text-white">
            Description
          </label>
          

              
              <textarea
                className="h-40 text-base leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 bg-white border-0 rounded"
              
                value={categoryDetails.description}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, description: e.target.value })}
              />
            </div>
          </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <button onClick={(e)=>handleEditCategory(e)} className="mt-9 font-semibold leading-none text-white py-4 px-10 bg-blue-600 rounded hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:outline-none">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>

  )
}

export default AdminEditCategory