import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import { tutorSignup, useTutorValidate } from '../../../Utils/Validation/tutorSignupvalidation';
import { registerTutor } from '../../../Utils/api/types';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import {ToastContainer} from "react-toastify";
import { tutorRegistration } from '../../../Utils/config/axios.PostMethods';
import { tutorlogin } from '../../../Slices/tutorSlice/tutorSlice';
import { useSelector } from 'react-redux';
import {toast } from 'sonner';
import { useGoogleSignIn } from '../../../Utils/customHooks/customHooks';
import { Auth } from "firebase/auth";
import { auth } from '../../../Utils/config/firebase.config';
import { tutorregister } from '../../../Slices/tutorSlice/tutorSlice';
import { tutorGoogleAuthVerification } from '../../../Utils/config/axios.GetMethods';
import LoadingSpinner from '../../Common/LoadingSpinner';

function tutorRegister() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleSubmit, errors, register } = useTutorValidate();
    const [loading, setLoading] = useState(false);

    type tutorSignup = {
        tutorname: string;
        tutoremail: string,
        phone: string,
        password: string;
    };

    const {tutor} = useSelector((state: any) => state.tutor);

    // useEffect(()=>{
    //     if(tutor) {
    //         navigate("/tutorotp",{replace: true});
    //     }
    // },[]);



    const googleTutorSignin = async (auth: Auth) => {
      try {
        const response = await useGoogleSignIn(auth);
        console.log(response, "response--------------------------");
        if (response.status && response.userEmail !== null) {
          try {
            const res: any = await tutorGoogleAuthVerification(response.userEmail,response.userName);
            if (res.status === 200) {
              if (res.data.userExist) {
                console.log(res.data.token, "res");
                localStorage.setItem("Token", `${res.data.token}`);
                localStorage.setItem("isVerified",'true')
                dispatch(tutorregister(res.data.response));
                // dispatch(tutorregister(res.data.token));
                navigate("/tutor/home", { replace: true });
              } else {
                console.log("user not exist");
              }
            } else if (res.response.status === 404) {
              console.log(res.response.data.errors[0].message, "error message");
            }
          } catch (error) {
            console.log("something went wrong ook");
          }
        }
      } catch (error) {
        console.log("something went wrong");
      }
    };
  
  


    const handleTutorRegister = async (data: tutorSignup) => {
        try {
          setLoading(true);
            const response: any = await tutorRegistration(data);
            console.log(response)
            if (response.status === 200) {
                navigate("/tutor/tutorotp");}
        } catch (error) {
            console.error("Registration error:", error);
        }
        finally {
          setLoading(false);
        }
    };
    
    return (
      <>
      {/* component */}
      <div className="bg-gradient-to-b from-blue-300 h-screen w-screen fixed">
      {loading && <LoadingSpinner />}
      <div className="absolute top-3 left-0 flex items-center" style={{ paddingLeft: '3rem' }}>
    <img src="/public/Logo.png" alt="Logo" className="w-8 h-8 mr-2" />
    <p className="text-2xl text-sky-700 font-medium">LearnWorld</p>
  </div>
        <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
          <div
            className="flex rounded-lg w-full sm:w-3/4 lg:w-1/2 bg-gray-200 sm:mx-0"
            style={{ height: 500 }}
          >
    
            <div className="flex flex-col w-full md:w-2/3 p-4">
              <div className="flex flex-col flex-1 justify-center mb-8">
                <h1 className="text-2xl text-center font-medium text-sky-700">Create your account</h1>
                <div className="w-full mt-4">
  
                  <form onSubmit={handleSubmit(handleTutorRegister)}
                    className="form-horizontal w-3/4 mx-auto">
                      <div className="flex flex-col mt-4">
  
                       {errors.tutorname ? (
                                      <span className="text-sm font-normal text-red-600 ">{errors.tutorname?.message}</span>
                                  ) : null}
  
                      <input
                        type="text"
                        {...register("tutorname")}
                        className="flex-grow h-8 px-2 border rounded text-xs"
                        name="tutorname"
                        defaultValue=""
                        placeholder="Name"
                      />
                  
                    </div>
                    <div className="flex flex-col mt-4">
  
                      {errors.tutoremail ? (
                                      <span className="text-sm font-normal text-red-600">{errors.tutoremail?.message}</span>
                                        ): null}
                      <input
                        type="text"
                        {...register("tutoremail")}
                        className="flex-grow h-8 px-2 border rounded text-xs"
                        name="tutoremail"
                        defaultValue=""
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                    {errors.phone ? (
                                      <span className="text-sm font-normal text-red-600">{errors.phone?.message}</span>
                                        ): null}
                      <input
                        type="text"
                        {...register("phone")}
                        className="flex-grow h-8 px-2 border rounded text-xs"
                        name="phone"
                        defaultValue=""
                        placeholder="Mobile Number"
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                    {errors.password ? (
                                      <span className="text-sm font-normal text-red-600">{errors.password?.message}</span>
                                        ): null}
                      <input
                        type="password"
                        {...register("password")}
                        className="flex-grow h-8 px-2 rounded border text-xs"
                        name="password"
                        placeholder="Password"
                      />
                    </div>
                    
                    <div className="flex flex-col mt-8">
                      <button
                        type="submit"
                        className="bg-sky-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                      >
                        Register
                      </button>
                    </div>
                  </form>

                  <div className="flex justify-center mt-5">
               <button onClick={() => googleTutorSignin(auth)} className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
  <svg
    className="h-6 w-6 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="800px"
    height="800px"
    viewBox="-0.5 0 48 48"
    version="1.1"
  >
    <title>Google-color</title>
    <desc>Created with Sketch.</desc>
    <g
      id="Icons"
      stroke="none"
      strokeWidth={1}
      fill="none"
      fillRule="evenodd"
    >
      <g id="Color-" transform="translate(-401.000000, -860.000000)">
        <g id="Google" transform="translate(401.000000, 860.000000)">
          <path
            d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
            id="Fill-1"
            fill="#FBBC05"
          ></path>
          <path
            d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
            id="Fill-2"
            fill="#EB4335"
          ></path>
          <path
            d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
            id="Fill-3"
            fill="#34A853"
          ></path>
          <path
            d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
            id="Fill-4"
            fill="#4285F4"
          ></path>
        </g>
      </g>
    </g>
  </svg>
  <span>Continue with Google</span>
</button>

               </div>

                  <div className="text-center mt-4">
                    <Link
                      className="no-underline hover:underline text-sky-600 text-xs"
                      to="/tutor/tutorlogin"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:w-1/3 rounded-r-lg rounded-l-lg sm:flex justify-center items-center bg-sky-800" >
                <img src="../public/girl2.png" className='w-96 h-96 z-20 fixed' alt="" />
          </div>
          </div>
        </div>
      </div>
    </>
    
    
    )
  }
  

export default tutorRegister