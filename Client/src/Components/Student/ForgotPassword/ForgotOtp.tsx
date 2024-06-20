import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentForgotOtp } from "../../../Utils/config/axios.PostMethods";

function ForgotOtp() {

    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit: any = async (e: any) => {
      try {
        e.preventDefault();
        const res: any = await studentForgotOtp(otp);
        console.log(res);
        if (res.status) {
          navigate("/newpassword", { replace: true });
        }
      } catch (error) {}
    };


  return (
    <>
     <div className="bg-blue-100 h-screen w-screen">
     <div className="absolute top-3 left-0 flex items-center" style={{ paddingLeft: '3rem' }}>
  <img src="public/Logo.png" alt="Logo" className="w-8 h-8 mr-2" />
  <p className="text-2xl text-sky-700 font-medium">LearnWorld</p>
</div>
    <div className="absolute top-3 left-0 flex items-center" style={{ paddingLeft: '3rem' }}>
  <img src="public/Logo.png" alt="Logo" className="w-8 h-8 mr-2" />
  <p className="text-2xl text-sky-700 font-medium">LearnWorld</p>
</div>
      <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div
          className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0"
          style={{ height: 500 }}
        >
          <div
            className="hidden md:block md:w-1/2 rounded-r-lg"
            style={{
              background:
                'url("public/7cc6371b12bdcae59e0cd65dd669ab5e.jpg")',
              backgroundSize: "auto",
              backgroundPosition: "center center"
            }}
          />
  
          <div className="flex flex-col w-full md:w-1/2 p-4">
            <div className="flex flex-col flex-1 justify-center mb-8">
              <h1 className="text-2xl text-center font-medium text-sky-600">Email Verifiaction</h1>
              <div className="w-full mt-4">
                <form
                  className="form-horizontal w-3/4 mx-auto" onSubmit={(e) => handleSubmit(e)}>
                  <div className="flex flex-col mt-4">
                    <input
                      type="text"
                      className="flex-grow h-8 px-2 rounded border border-grey-400 text-xs"
                      name="otp"
                      required={true}
                      placeholder="Enter the otp"
                      onChange={(e)=>setOtp(e.target.value)}
                      
                    />
                  </div>
                  
                  <div className="flex flex-col mt-8">
                    <button
                      type="submit"
                      className="bg-sky-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                    >
                      Verify
                    </button>
                  </div>
                </form>
               
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </>
  )
}

export default ForgotOtp