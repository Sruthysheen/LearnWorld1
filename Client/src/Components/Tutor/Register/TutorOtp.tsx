import React, {useState, useEffect} from 'react';
import { OtpVerificationTutor } from '../../../Utils/config/axios.PostMethods';
import { resendOtpTutor, tutorOtpExpiry } from '../../../Utils/config/axios.GetMethods';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { tutorregister } from '../../../Slices/tutorSlice/tutorSlice';

function TutorOtp() {

    const [otp, setOtp] = useState('');
    const [counter, setCounter] = React.useState(15);
    const navigate = useNavigate();
const dispatch=useDispatch()

    const handleSubmit: any =async(event: any) =>{
        try {
            event.preventDefault();
            const res: any = await OtpVerificationTutor(otp);
            console.log(res)
            if(res.status==200) {
              localStorage.setItem("Token",`${res.data.token}`);
              localStorage.setItem("isVerified",'true')
              dispatch(tutorregister(res.data.response));
              navigate("/tutor/home", {replace: true});
            }
            } catch (error) {
              localStorage.setItem("isVerified",'false')
              console.log(error,'ERROR' );
          }
    };
    const handleResendOtp = async () => {
      try {
        
        const res: any = await resendOtpTutor(); 
       if(res.status==200){
        setCounter(15)
        toast.success("Resend otp send success")
       }else{
        toast.success("Resend otp send failed")
    
       }
        
      } catch (error) {
        console.log(error, 'ERROR');
      }
    };

    useEffect(() => {
      let timer: ReturnType<typeof setInterval> | undefined;
    
      if (counter > 0) {
        timer = setInterval(() => setCounter(counter - 1), 1000);
      } else if (counter == 0) {
    
       const res:any= tutorOtpExpiry();
       if(res.status==200){
          toast.success(res.data.message)
       }
      }return () => {
        if (timer !== undefined) {
          clearInterval(timer);
        }
      };
    }, [counter]);
    
    


  return (
     <>
     <div className="bg-gradient-to-b from-blue-300 h-screen w-screen">
     <div className="absolute top-3 left-0 flex items-center" style={{ paddingLeft: '3rem' }}>
  <img src="/public/Logo.png" alt="Logo" className="w-8 h-8 mr-2" />
  <p className="text-2xl text-sky-700 font-medium">LearnWorld</p>
</div>
      <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div
          className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0"
          style={{ height: 500 }}
        >
          
  
          <div className="flex flex-col w-full md:w-1/2 p-4">
            <div className="flex flex-col flex-1 justify-center mb-8">
              <h1 className="text-2xl text-center font-medium text-sky-600">Email Verifiaction</h1>
              <div className="w-full mt-4">
                <form
                  className="form-horizontal w-3/4 mx-auto" onSubmit={(event) => handleSubmit(event)}>
                  <div className="flex flex-col mt-4">
                    <input
                      type="text"
                      className="flex-grow h-8 px-2 rounded border border-grey-400"
                      name="otp"
                      required={true}
                      placeholder="Enter the otp"
                      onChange={(event)=> setOtp(event.target.value)}
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
                <div className="mt-3">
  <div className="text-center text-sm text-gray-500">
    Resend OTP in <span className={`font-medium ${counter < 10 ? 'text-green-500' : 'text-green-500'}`}>00:{counter < 10 ? `0${counter}` : counter}</span>
  </div>
</div>

<div className="text-center">
                    <button
                      className="no-underline hover:underline text-sky-600 text-sm"
                      onClick={handleResendOtp}
                      disabled={counter > 0}
                    >
                      Resend OTP
                    </button>
                  </div>

              </div>
            </div>
          </div>
          <div
            className="hidden md:block md:w-1/2 rounded-r-lg"
            style={{
              background:
                'url("/public/1582bef8a36e72984a12ffe913124ce0.jpg")',
              backgroundSize: "auto",
              backgroundPosition: "center center"
            }}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default TutorOtp