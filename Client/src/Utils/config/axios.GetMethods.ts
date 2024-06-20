import { AxiosRequestConfig } from "axios";
import { api, apiRequest,axiosInstance } from "./axios.config";



//student---------------------------------------------------------------------------
export const resendOtp = async() => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: '/student/resendotp',
       
      }
      return await apiRequest(config)
    } catch (error) {
      throw error;
    }
  }



  export const otpExpiry = async() => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: '/student/otpExpiry',
       
      }
      return await apiRequest(config)
    } catch (error) {
      throw error;
    }
  }



  export const googleAuthVerification = async (emailPayload: string) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/student/firebaseAuthVerify?email=${emailPayload}`,
    };
    return await apiRequest(config);
  };
  

  export const getAllStudentCourses = async()=>{
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url:"/student/getcourses"
      }
      return await apiRequest(config)
    } catch (error) {
        throw(error);
    }
  }

  export const getCartItems = async(studentId:any)=>{
    const config = {
      method: "GET",
      url: `/student/cart/${studentId}`,
    }; 
    return await axiosInstance(config);
  };


  export const getWishlistItems = async(studentId:any)=>{
    const config = {
      method: "GET",
      url: `/student/wishlist/${studentId}`,
    };
    return await axiosInstance(config);
  };


export const fetchCategory = async(categoryId:string)=>{
  const config = {
    method: "GET",
    url: `student/get-category/${categoryId}`,
  }
  return await axiosInstance(config);
  
}
  

export const enrolledCourse = async(studentId:string)=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/student/enrolled-course/${studentId}`,
  }
  return await axiosInstance(config);
}



export const getAllCatagoryStudent=async()=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/student/get-category`,
  };
  return await axiosInstance(config);
  
}

  //tutor------------------------------------------------------------------------------------

  export const resendOtpTutor = async() => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: '/tutor/resendotp',
       
      }
      return await apiRequest(config)
    } catch (error) {
      throw error;
    }
  }

  export const tutorOtpExpiry = async() => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: '/tutor/otpExpiry',
       
      }
      return await apiRequest(config)
    } catch (error) {
      throw error;
    }
  }


  export const tutorGoogleAuthVerification = async (emailPayload: string,name:any) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/tutor/firebaseAuthVerify?email=${emailPayload}&&name=${name}`,
    };
    return await apiRequest(config);
  };
  


  export const getTutorBio = async (tutorId: any) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/tutor/tutorProfile/${tutorId}`,
    };
    return await apiRequest(config);
  };



  export const getAllCourses = async (tutorId : any ) =>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/tutor/getallcourse/${tutorId}`,
    }
    return await axiosInstance(config);
  }
  



  export const getAllCatagoryTutor=async()=>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/tutor/get-category`,
    };
    return await axiosInstance(config);
    
  }


  
  export const fetchChatMessages = async(chatId: any)=>{
    console.log(chatId,'CHHHH');
    
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/chat/fetch-chat?id=${chatId}`,
    }
    return await axiosInstance(config);
  }

  export const fetchTutorChatMessages= async(chatId: any)=>{
    
    
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/chat/fetch-tutor-chat?id=${chatId}`,
    }
    return await axiosInstance(config);
  }


  export const getTutor = async(tutorId:any)=>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/student/get-tutor/${tutorId}`
    }
    return await axiosInstance(config)
  }


  export const enrolledStudents = async(tutorId:string)=>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/tutor/enrolled-students/${tutorId}`
    }
    return await axiosInstance(config)
  }

  export const getUserProfile = async (studentId: any) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/tutor/user-profile/${studentId}`,
    };
    return await axiosInstance(config);
  };


  export const studentTutorListing = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/student/tutor-list`,
    };
    return await axiosInstance(config);
  };
 


  //Admin----------------------------------------------------------------------------------

  export const adminListAllStudents = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/admin/adminstudent`,
    };
    return await axiosInstance(config);
  };



  export const adminListAllTutors = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/admin/admintutor`,
    };
    return await axiosInstance(config);
  };


  export const axiosTest=async()=>{
    
    const response=await axiosInstance.get('http://localhost:5000/student/test')
    console.log(response,'TTTEST RESPONCE');
    

  }

  export const adminListCategory = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/admin/admincategory`
    }
    return await axiosInstance(config)
  };
  

  export const getCategory = async (id:any) => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: `/admin/getcategoryid/${id}`
      };
      return await axiosInstance(config);
    } catch (error) {
      throw error;  
    }
}

export const getAllCatagory=async()=>{
  console.log('INSide the APII');
  
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/admin/admincategory`,
  };
  return await axiosInstance(config);
  
}


// export const getAllCatagoryForView=async()=>{
//   console.log('INSide the APII');
  
//   const config: AxiosRequestConfig = {
//     method: "GET",
//     url: `/admin/admincategoryview`,
//   };
//   const response:any = await apiRequest(config);
//   return response.data || [];
// }
