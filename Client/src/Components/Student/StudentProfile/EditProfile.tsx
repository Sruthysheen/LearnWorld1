import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { register } from "../../../Slices/studentSlice/studentSlice";
import { studentEditProfile } from "../../../Utils/config/axios.PostMethods";

interface FormInterface {
    studentname: string;
    studentemail: string;
    phone: string;
    photo:string
  }
function EditProfile() {

    const dispatch=useDispatch()
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormInterface>({
    studentname: "",
    studentemail: "",
    phone: "",
    photo:""
  });

  const [img, setImg] = useState<File | null>(null);
  const { student } = useSelector((state: any) => state.student);

  const [studentDetails, setStudentDetails] = useState<FormInterface>({
    studentname: "",
    studentemail: "",
    phone: "",
    photo:""
  });

  useEffect(() => {
    if (student) {
      setStudentDetails({
        studentname: student.studentname,
        studentemail: student.studentemail,
        phone: student.phone,
        photo:student.photo || ""
      });
    }
  }, [student]);

  const validateInput = (name: string, value: string) => {
    let errorMsg = '';
    switch (name) {
      case 'studentname':
        errorMsg = !value.trim() ? 'Name is required' : '';
        break;
      case 'studentemail':
        errorMsg = !value.trim() ? 'Email is required' : !/^\S+@\S+\.\S+$/.test(value) ? 'Email is not valid' : '';
        break;
      case 'phone':
        errorMsg = !value.trim() ? 'Phone number is required' : !/^\d{10}$/.test(value) ? 'Phone number must be 10 digits' : '';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return errorMsg === '';
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    validateInput(name, value)
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImg(file);
  };


  const upload = async () => {
  
   
    if (Object.values(errors).every(error => error === '')) {
      const formData = new FormData();
      formData.append('studentname', studentDetails.studentname);
      formData.append('studentemail', studentDetails.studentemail);
      formData.append('phone', studentDetails.phone);
      if (img) {
        formData.append('image', img, img.name);
      }

      try {
       
        console.log(localStorage.getItem('Token'),'000000000000000000000');
        const token=localStorage.getItem('Token')
        const response:any = await studentEditProfile(formData);
        toast.success('Profile updated successfully!');
       if(response.data.status){
        console.log('SUCCES');
        const student=response.data.data
        // setTutorDetails({
        //   tutorname: tutor.tutorname,
        //   tutoremail: tutor.tutoremail,
        //   phone: tutor.phone,
        // });
        dispatch(register(student));
        toast.success("user Updated ")
        navigate('/profile')
        
       }
      } catch (error) {
        toast.error('Failed to update profile.');
        console.error(error);
      }
    } else {
      toast.error('Please fix the errors before submitting.');
    }
  };




  return (
    <>
     <div className="h-screen fixed w-full bg-gradient-to-br from-sky-50 to-sky-300">
      <div className=" ">
        <div className="p-4 ">
          <div className="h-28  w-full flex justify-center items-center ">
{studentDetails.photo == "" ? (
  <>
            <img src="https://i.pinimg.com/564x/b3/79/b7/b379b7e09cacd6cc657ad19071cd21d8.jpg" alt="" className="w-24 h-24 rounded-full object-fill " />

  </>
):(
            <img src={studentDetails.photo} alt="" className="w-24 h-24 rounded-full object-fill " />

)}
          </div>
          <h1 className="text-sky-800 text-center pb-8 font-light text-4xl md:text-5xl lg:text-6xl">
            Edit Profile
          </h1>
          <form className="flex flex-col items-center">
            <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
              <div className="flex flex-col md:flex-row">
                <input
                  id="name"
                  type="text"
                  className="my-2 py-2 px-4 rounded-md bg-white text-gray-900 w-full md:w-1/2 md:mr-2 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Name"
                  name="studentname"
                  value={studentDetails.studentname}
                  onChange={handleChange}
                />
                {errors.studentname && <p className="text-red-500">{errors.studentname}</p>}
                <input
                  id="email"
                  type="email"
                  className="my-2 py-2 px-4 rounded-md bg-white text-gray-900 w-full md:w-1/2 md:ml-2 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Email"
                  name="studentemail"
                  value={studentDetails.studentemail}
                  onChange={handleChange}
                />
                {errors.studentemail && <p className="text-red-500">{errors.studentemail}</p>}
              </div>
              <input
                id="phone"
                type="text"
                className="my-2 py-2 px-4 rounded-md bg-white text-gray-900 w-full outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Phone"
                name="phone"
                value={studentDetails.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              <div className="mt-2">
                <label htmlFor="avatar" className="text-black">
                  Upload Image:
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="image"
                  accept="image/png, image/jpeg"
                  className="my-2 py-2 px-4 rounded-md bg-white text-gray-600 w-full outline-none focus:ring-2 focus:ring-blue-600"
                  onChange={handleImage}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={upload}
              className="text-md mt-5 rounded-md py-2 px-4 bg-sky-600 hover:bg-blue-700 text-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default EditProfile