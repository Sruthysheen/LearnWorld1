import { Axios, AxiosRequestConfig } from "axios";
import {loginStudent, registerStudent, loginTutor, registerTutor, loginAdmin, AdminCategoryData} from "../api/types";
import { apiRequest, axiosInstance } from "./axios.config";



//student------------------------------------------------------------------------
//-------------------------------------------------------------------------------

export const studentRegistration = async (registerPayload: registerStudent) => {
    const config: AxiosRequestConfig = {
        method:"POST",
        url: `/student/register`,
        data: registerPayload,
    };
    return await apiRequest(config);
};



export const OtpVerification = async (otp : string) =>{
    const config: AxiosRequestConfig = {
        method:"POST",
        url: `/student/otp`,
        data: {otp}
    }
    return await apiRequest(config);
}


 export const studentLogin = async(loginPayload: loginStudent) => {
    try {
        const config: AxiosRequestConfig = {
            method:"POST",
            url: `/student/login`,
            data: loginPayload,
        };
        return await apiRequest(config);
    } catch (error) {
        throw error
    }
 };



 export const studentLogout = async() =>{
    try {
        const config: AxiosRequestConfig = {
            method:"POST",
            url:`/student/logout`,
        };
        return await apiRequest(config);
    } catch (error) {
        throw error
    }
 };


 
export const studentForgotPassword = async (forgetPasswordPayload: any) => {
  console.log(forgetPasswordPayload,'emailll');
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/student/forgotpassword`,
    data: forgetPasswordPayload,
  };
  return await apiRequest(config);
};



export const studentForgotOtp = async (otp : string) =>{
  const config: AxiosRequestConfig = {
      method:"POST",
      url: `/student/verifyforgototp`,
      data: {otp}
  }
  return await apiRequest(config);
}



export const studentNewPassword = async (newPassword: String) => {
  console.log(newPassword, "new password");

  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/student/newpassword`,
    data: { newPassword },
  };
  return await apiRequest(config);
};


export const addToCart = async(studentId:string,courseId:string)=>{
    const data = {
      studentId: studentId,
      courseId: courseId,
      
    }

    const config: AxiosRequestConfig ={
      method:"POST",
      url: `/student/addtocart`,
      data: data,
    }
    return await axiosInstance(config);
  }

export const addToWishlist = async(studentId:string, courseId:string)=>{
  const data = {
    studentId: studentId,
    courseId: courseId,
  }
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/student/addtowishlist`,
    data: data,
  }
  return await axiosInstance(config);
}
  

export const studentEditProfile = async(formData: FormData) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/student/editprofile`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }
  return await axiosInstance(config);
}



export const stripePayment = async(cartItems:any)=>{
  const config: AxiosRequestConfig = {
    method:"POST",
    url: `/student/stripepayment`,
    data: {cartItems},
  }
  return await apiRequest(config);
}


export const deleteCart = async (data: any) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url:`/student/clear-cart`,
    data:data
  
  };
  return await axiosInstance(config);
};
 

export const sendMessageFrom = async(tutorId: string, messages: string) =>{
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/chat/send-message`,
    data: {
      userId: tutorId,
      message: messages,
    }
};
  return await axiosInstance(config)
};
//admin------------------------------------------------------------------------
//-----------------------------------------------------------------------------


export const adminLogin = async (loginPayload: loginAdmin)=>{
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `/admin/adminlogin`,
        data: loginPayload,
      };
      return await apiRequest(config);
    }



export const adminLogout = async () => {
    try {
      const config: AxiosRequestConfig = {
        method: "POST",
        url: "/admin/adminlogout",
      };
      return await apiRequest(config);
    } catch (error) {
      throw error;
    }
  };



  export const addCategory = async (categoryPayload: AdminCategoryData) => {
    console.log("categoryPayload", categoryPayload);
  
    try {
      const config: AxiosRequestConfig = {
        method: "POST",
        url: "/admin/adminaddcategory",
        data: categoryPayload,
      };
  
      return await axiosInstance(config);
    } catch (error) {
      throw error;
    }
  };


  export const editCategory = async (categoryPayload: AdminCategoryData, id:string) => {
    console.log("categoryPayload", categoryPayload);
  
    try {
      const data = {
        id: id,
        categoryname: categoryPayload.categoryname,
        description: categoryPayload.description
      };
      const config: AxiosRequestConfig = {
        method: "POST",
        url: "/admin/editcategory",
        data: data,
      };
  
      return await axiosInstance(config);
    } catch (error) {
      throw error;
    }
  };






  //tutor--------------------------------------------------------------------
  //-------------------------------------------------------------------------


  export const tutorRegistration = async(registerPayload: registerTutor) =>{
 
    try {
        const config: AxiosRequestConfig ={
            method: "POST",
            url: `/tutor/tutorregister`,
            data: registerPayload
        }
        return await apiRequest(config)
    } catch (error) {
        throw error;
    }
 };


 export const OtpVerificationTutor = async (otp : string) =>{
    const config: AxiosRequestConfig = {
        method:"POST",
        url: `/tutor/tutorotp`,
        data: {otp}
    }
    return await apiRequest(config);
}



export const tutorLogin = async (loginPayload: loginTutor) =>{
  try {
   const config: AxiosRequestConfig = {
       method: "POST",
       url: `/tutor/tutorlogin`,
       data: loginPayload,
     }
     return await apiRequest(config)
  } catch (error) {
       throw error;
  }
};



export const tutorForgotPassword = async (forgetPasswordPayload: any) => {
  console.log(forgetPasswordPayload,'emailll');
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/tutorforgotpassword`,
    data: forgetPasswordPayload,
  };
  return await apiRequest(config);
};



export const tutorForgotOtp = async (otp : string) =>{
  const config: AxiosRequestConfig = {
      method:"POST",
      url: `/tutor/verifyforgototptutor`,
      data: {otp}
  }
  return await apiRequest(config);
}



export const tutorNewPassword = async (newPassword: String) => {
  console.log(newPassword, "new password");

  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/tutornewpassword`,
    data: { newPassword },
  };
  return await apiRequest(config);
};




export const tutorLogout = async () => {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/tutor/tutorlogout",
     
    };

    return await apiRequest(config);
  } catch (error) {
    throw error;
  }
};


// export const editTutorProfile1 = async (tutorPayload: registerTutor,id:any) => {
//   console.log("tutorPayload", tutorPayload);

//   try {
//     const data={
//       id:id,
//       name:tutorPayload
//     }
//     const config: AxiosRequestConfig = {
//       method: "POST",
//       url: "/tutor/editProfile",
//       data: data,
//     };

//     return await apiRequest(config);
//   } catch (error) {
//     throw error;
//   }
// };

export const editTutorProfile = async(formData:FormData)=>{
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/edit-Profile`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }
  return await axiosInstance(config);
}

 
export const addNewCourse = async(formData:FormData)=>{
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/addnewcourse`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }
  return await axiosInstance(config);
}



export const editCourse = async(formData:FormData,courseId:string)=>{
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/editcourse/${courseId}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data : formData
  }
  return await axiosInstance(config);
}



export const addLesson = async(formData:FormData)=>{
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/addlesson`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }
  return await axiosInstance(config);
}


export const editLesson = async(formData:FormData,lessonId:string)=>{
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/tutor/editlesson/${lessonId}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }
  return await axiosInstance(config);
}



export const createConversation=async(data:any)=>{
  


  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/chat/createConversation`,
    data: data
  }
  return await axiosInstance(config);
}
