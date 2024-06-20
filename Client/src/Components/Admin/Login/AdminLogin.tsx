import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../../../Utils/config/axios.PostMethods';
import { loginAdmin } from '../../../Utils/api/types';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../Slices/adminSlice/adminSlice';
import { useAdminValidate } from '../../../Utils/Validation/adminLoginValidation';
import { toast } from 'react-toastify';





function AdminLogin() {
 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { errors, handleSubmit, register} = useAdminValidate();

    const {admin} = useSelector((state:any) => state.admin)

    useEffect ( () =>{
        if(admin){
          console.log("user is here");
          
          navigate('/admin/admindashboard',{ replace: true })
        }
      },[]);


      const handleLogin = async (data: loginAdmin) =>{
        try {
       
            const response:any = await adminLogin(data);
            if(response.status===200){
                dispatch(login (response.data.token))
                localStorage.setItem("Token", `${response.data.token}`);
                navigate("/admin/admindashboard", {replace: true});
            }
            else{
                if(response.response.status === 401){
                    toast.error(response.response.data.message)
                }
                else if (response.response.status === 500) {
                    toast.error(response.response.data.message)
                  
                  }


            }
        } catch (error) {
            
        } 
      }

     


  return (
    <>
   <div className="container mx-auto p-4 w-screen h-screen fixed"
    style={{
      backgroundImage: "url('/public/BgImage4.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
  <div className="w-full md:w-1/2 lg:w-1/3 mx-auto my-12">
    <h1 className="text-lg font-bold">Login</h1>
    <form className="flex flex-col mt-4" onSubmit={handleSubmit(handleLogin)}>
    <div className="mb-3">
                  {errors.adminemail ? (
                      <span className="text-sm font-normal text-red-600 ">
                        {errors.adminemail?.message}
                      </span>
                    ) : null}
      <input
        type="email"
        className="px-4 py-3 w-full rounded-md bg-white border border-gray-500 focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
        placeholder="Email address"
        {...register("adminemail")}
      />
       </div>
       <div className="mb-3">
                  {errors.adminemail ? (
                      <span className="text-sm font-normal text-red-600 ">
                        {errors.adminemail?.message}
                      </span>
                    ) : null}
      <input
        type="password"
        className="px-4 py-3 mt-4 w-full rounded-md bg-white border border-gray-500 focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
        placeholder="Password"
        {...register("password")}
      />
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-3  leading-6 text-base rounded-md border border-transparent text-white bg-sky-500 text hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-flex w-full justify-center items-center font-medium focus:outline-none"
      >
        Login
      </button>
     
    </form>
  </div>
</div>

    </>
  )
}

export default AdminLogin