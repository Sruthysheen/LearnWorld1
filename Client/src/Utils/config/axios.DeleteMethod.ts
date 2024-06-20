import axios, { AxiosRequestConfig } from "axios";
import { apiRequest, axiosInstance } from "./axios.config";


export const deleteCategory = async (id: string) => {
    const config: AxiosRequestConfig = {
      method: "DELETE",
      url: `/admin/deletecategory/${id}`,
    };
    return await axiosInstance(config);
  };


export const deleteCartItem = async(cartItemId:string) =>{
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/student/removecartitem/${cartItemId}`
  }
  return await axiosInstance(config);
}


export const deleteWishlistItem = async(wishlistItemId:string) =>{
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/student/removeitem/${wishlistItemId}`
  }
  return await axiosInstance(config);
}

