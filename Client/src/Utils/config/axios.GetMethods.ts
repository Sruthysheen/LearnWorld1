import { AxiosRequestConfig } from "axios";
import { api, apiRequest,axiosInstance } from "./axios.config";



//student---------------------------------------------------------------------------
export const resendOtp = async() => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: '/api/student/resendotp',
       
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
        url: '/api/student/otpExpiry',
       
      }
      return await apiRequest(config)
    } catch (error) {
      throw error;
    }
  }



  export const googleAuthVerification = async (emailPayload: string) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/student/firebaseAuthVerify?email=${emailPayload}`,
    };
    return await apiRequest(config);
  };
  

  export const getAllStudentCourses = async()=>{
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url:"/api/student/getcourses"
      }
      return await apiRequest(config)
    } catch (error) {
        throw(error);
    }
  }

  export const getCartItems = async(studentId:any)=>{
    const config = {
      method: "GET",
      url: `/api/student/cart/${studentId}`,
    }; 
    return await axiosInstance(config);
  };


  export const getWishlistItems = async(studentId:any)=>{
    const config = {
      method: "GET",
      url: `/api/student/wishlist/${studentId}`,
    };
    return await axiosInstance(config);
  };


export const fetchCategory = async(categoryId:string)=>{
  const config = {
    method: "GET",
    url: `/api/student/get-category/${categoryId}`,
  }
  return await axiosInstance(config);
  
}
  

export const enrolledCourse = async(studentId:string)=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/enrolled-course/${studentId}`,
  }
  return await axiosInstance(config);
}



export const getAllCatagoryStudent=async()=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/get-category`,
  };
  return await axiosInstance(config);
  
}


export const getBalance = async(studentId:string)=>{
  const config: AxiosRequestConfig = {
    method:"GET",
    url: `/api/student/wallet-balance/${studentId}`
  }
  return await axiosInstance(config);
}


export const getTransactions = async(studentId:string)=>{
  const config: AxiosRequestConfig = {
    method:"GET",
    url: `/api/student/wallet-transactions/${studentId}`
  }
  return await axiosInstance(config);
}


export const getRating = async(courseId:string,studentId:string)=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/get-rating/${courseId}/${studentId}`,
  }
  return await axiosInstance(config)
}


export const getAllRatings = async(courseId:string)=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/all-ratings/${courseId}`
  }
  return await axiosInstance(config)
}



export const fetchQuizzesByCourse = async(courseId:string)=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/student-view-quiz/${courseId}`
  }
  return await axiosInstance(config)
}


export const getAverageRatings = async()=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/get-average-rating`
  }
  return await axiosInstance(config)
}


export const fetchStudentProgress = async(courseId:string,studentId:string)=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/student/get-progress/${courseId}/${studentId}`
  }
  return await axiosInstance(config)
}

//tutor------------------------------------------------------------------------------------

  export const resendOtpTutor = async() => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: '/api/tutor/resendotp',
       
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
        url: '/api/tutor/otpExpiry',
       
      }
      return await apiRequest(config)
    } catch (error) {
      throw error;
    }
  }


  export const tutorGoogleAuthVerification = async (emailPayload: string,name:any) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/firebaseAuthVerify?email=${emailPayload}&&name=${name}`,
    };
    return await apiRequest(config);
  };
  


  export const getTutorBio = async (tutorId: any) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/tutorProfile/${tutorId}`,
    };
    return await apiRequest(config);
  };



  export const getAllCourses = async (tutorId : any ) =>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/getallcourse/${tutorId}`,
    }
    return await axiosInstance(config);
  }
  



  export const getAllCatagoryTutor=async()=>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/get-category`,
    };
    return await axiosInstance(config);
    
  }


  
  export const fetchChatMessages = async(chatId: any)=>{
    console.log(chatId,'CHHHH');
    
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/chat/fetch-chat?id=${chatId}`,
    }
    return await axiosInstance(config);
  }

  export const fetchTutorChatMessages= async(chatId: any)=>{
    
    
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/chat/fetch-tutor-chat?id=${chatId}`,
    }
    return await axiosInstance(config);
  }


  export const getTutor = async(tutorId:any)=>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/student/get-tutor/${tutorId}`
    }
    return await axiosInstance(config)
  }


  export const enrolledStudents = async(tutorId:string)=>{
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/enrolled-students/${tutorId}`
    }
    return await axiosInstance(config)
  }

  export const getUserProfile = async (studentId: any) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/user-profile/${studentId}`,
    };
    return await axiosInstance(config);
  };


  export const studentTutorListing = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/student/tutor-list`,
    };
    return await axiosInstance(config);
  };


  export const getSingleCourse = async (courseId:string) => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/tutor/single-course/${courseId}`,
    };
    return await axiosInstance(config);
  };

  
  export const fetchQuizzesByCourseAndTutor = async (courseId: string, tutorId: string) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/tutor/view-quiz/${courseId}/${tutorId}`
    };
    return await axiosInstance(config);
  };



  //Admin----------------------------------------------------------------------------------

  export const adminListAllStudents = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/admin/adminstudent`,
    };
    return await axiosInstance(config);
  };



  export const adminListAllTutors = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/admin/admintutor`,
    };
    return await axiosInstance(config);
  };


  export const axiosTest=async()=>{
    
    const response=await axiosInstance.get('https://learnworld.online/student/test')
    console.log(response,'TTTEST RESPONCE');
    

  }

  export const adminListCategory = async () => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `/api/admin/admincategory`
    }
    return await axiosInstance(config)
  };
  

  export const getCategory = async (id:any) => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: `/api/admin/getcategoryid/${id}`
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
    url: `/api/admin/admincategory`,
  };
  return await axiosInstance(config);
  
}


export const getAllCourseForAdmin = async()=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/admin/all-courses`
  }
  return await axiosInstance(config);
}


export const getTotalRevenue =async()=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/admin/total-revenue`
  }
  return await axiosInstance(config)
}

export const getAllOrders =async()=>{
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/api/admin/get-orders`
  }
  return await axiosInstance(config)
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
