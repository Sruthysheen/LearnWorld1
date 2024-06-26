import axios, { AxiosRequestConfig } from "axios";
import { apiRequest, axiosInstance } from "./axios.config";


export const deleteCategory = async (id: string) => {
    const config: AxiosRequestConfig = {
      method: "DELETE",
      url: `/api/admin/deletecategory/${id}`,
    };
    return await axiosInstance(config);
  };


export const deleteCartItem = async(cartItemId:string) =>{
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/api/student/removecartitem/${cartItemId}`
  }
  return await axiosInstance(config);
}


export const deleteWishlistItem = async(wishlistItemId:string) =>{
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/api/student/removeitem/${wishlistItemId}`
  }
  return await axiosInstance(config);
}



export const deleteLesson = async (courseId:string,lessonId:string)=>{
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/api/tutor/delete-lesson/${courseId}/${lessonId}`
  };
  return await axiosInstance(config)
}


