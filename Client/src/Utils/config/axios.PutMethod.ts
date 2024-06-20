import axios, { AxiosRequestConfig } from "axios";
import { apiRequest, axiosInstance } from "./axios.config";



export const adminBlockStudent = async (userId: string) => {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/admin/blockstudent/${userId}`,
    };
    return await axiosInstance(config);
  };
  


  export const adminUnblockStudent = async (userId: string) => {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/admin/unblockstudent/${userId}`,
    };
    return await axiosInstance(config);
  };



  export const adminBlockTutor = async (tutorId: string) => {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/admin/blocktutor/${tutorId}`,
    };
    return await axiosInstance(config);
  };
  

  
  export const adminUnblockTutor = async (tutorId: string) => {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/admin/unBlocktutor/${tutorId}`,
    };
    return await axiosInstance(config);
  };