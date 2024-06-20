import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addCategory } from "../../../Utils/config/axios.PostMethods";
import { CategoryInfo, CategoryValidation } from "../../../Utils/Validation/addCategoryValidation";
import { AdminCategoryData } from "../../../Utils/api/types";

function AdminAddCategory() {

  const {errors, handleSubmit, register, reset} = CategoryValidation();

const navigate = useNavigate();


const handleAddCategory = async (data: CategoryInfo) => {
  try {
    const response:any = await addCategory({ ...data });
  console.log(response.status,'IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
  
    if (response.data.status) {
      toast.success(response.data.message);
      navigate('/admin/admincategory');
    } else  {
      toast.error(response.data.message)
    }
  } catch (error) {
      toast.error('Network error, please try again later.');
  }
}

  
return (
  <>
    <>
      {/* component */}
      <div className="bg-gray-300 h-screen">
        <div className="bg-gradient-to-b from-blue-50 to-blue-300 h-80" />
        <div className="max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 mb-12">
          <div className="bg-sky-700 w-full shadow rounded p-8 sm:p-12 -mt-72">
            <p className="text-3xl font-bold leading-7 text-center text-white">
              Create New Category
            </p>
            <form onSubmit={handleSubmit(handleAddCategory)}>
              <div className="md:flex items-center mt-12">
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="flex flex-col mt-4">
                    {errors.categoryname ? (
                      <span className="text-sm font-normal text-red-200 ">
                        {errors.categoryname?.message}
                      </span>
                    ) : (
                      <label className="font-semibold leading-none text-white">
                        Category Name
                      </label>
                    )}
                    <input
                      type="text"
                      {...register('categoryname')}
                      className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border-0 bg-white rounded"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="w-full flex flex-col mt-8">
                  <div className="flex flex-col mt-4">
                    {errors.categoryname ? (
                      <span className="text-sm font-normal text-red-300 ">
                        {errors.description?.message}
                      </span>
                    ) : (
                      <label className="font-semibold leading-none text-white">
                        Description
                      </label>
                    )}
                    <textarea
                      className="h-40 text-base leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 bg-white border-0 rounded"
                      defaultValue={""}
                      {...register('description')}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full">
                <button className="mt-9 font-semibold leading-none text-white py-4 px-10 bg-blue-600 rounded hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:outline-none">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  </>
);

}

export default AdminAddCategory
