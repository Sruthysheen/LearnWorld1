import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { tutorregister } from "../../../Slices/tutorSlice/tutorSlice";
import { editTutorProfile } from "../../../Utils/config/axios.PostMethods";

interface FormInterface {
  tutorname: string;
  tutoremail: string;
  phone: string;
  photo:string
}

function TutorBio() {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  // const [form, setForm] = useState<FormInterface>({
  //   tutorname: "",
  //   tutoremail: "",
  //   phone: "",

  // });
  const [errors, setErrors] = useState<FormInterface>({
    tutorname: "",
    tutoremail: "",
    phone: "",
    photo:""
  });
  const [img, setImg] = useState<File | null>(null);
  const { tutor } = useSelector((state: any) => state.tutor);


  const [tutorDetails, setTutorDetails] = useState<FormInterface>({
    tutorname: "",
    tutoremail: "",
    phone: "",
    photo:""
  });

  useEffect(() => {
    if (tutor) {
      setTutorDetails({
        tutorname: tutor.tutorname,
        tutoremail: tutor.tutoremail,
        phone: tutor.phone,
        photo:tutor.photo || ""
      });
    }
  }, [tutor]);

  const validateInput = (name: string, value: string) => {
    let errorMsg = '';
    switch (name) {
      case 'tutorname':
        errorMsg = !value.trim() ? 'Name is required' : '';
        break;
      case 'tutoremail':
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
    setTutorDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    validateInput(name, value)
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImg(file);
  };

  const upload = async () => {
  
   
    if (Object.values(errors).every(error => error === '')) {
      const formData = new FormData();
      formData.append('tutorname', tutorDetails.tutorname);
      formData.append('tutoremail', tutorDetails.tutoremail);
      formData.append('phone', tutorDetails.phone);
      if (img) {
        formData.append('image', img, img.name);
      }

      try {
       
        console.log(localStorage.getItem('Token'),'000000000000000000000');
        const token=localStorage.getItem('Token')
        const response = await editTutorProfile(formData)
        toast.success('Profile updated successfully!');
       if(response.data.status){
        console.log('SUCCES');
        const tutor=response.data.data
        // setTutorDetails({
        //   tutorname: tutor.tutorname,
        //   tutoremail: tutor.tutoremail,
        //   phone: tutor.phone,
        // });
        dispatch(tutorregister(tutor));
        toast.success("user Updated ")
        
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
    <div className="h-screen fixed w-full bg-gradient-to-br from-sky-50 to-sky-300">
      <div className=" ">
        <div className="p-4 ">
          <div className="h-28  w-full flex justify-center items-center ">
{tutorDetails.photo == "" ? (
  <>
            <img src="https://i.pinimg.com/564x/b3/79/b7/b379b7e09cacd6cc657ad19071cd21d8.jpg" alt="" className="w-24 h-24 rounded-full object-fill " />

  </>
):(
            <img src={tutorDetails.photo} alt="" className="w-24 h-24 rounded-full object-fill " />

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
                  name="tutorname"
                  value={tutorDetails.tutorname}
                  onChange={handleChange}
                />
                {errors.tutorname && <p className="text-red-500">{errors.tutorname}</p>}
                <input
                  id="email"
                  type="email"
                  className="my-2 py-2 px-4 rounded-md bg-white text-gray-900 w-full md:w-1/2 md:ml-2 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Email"
                  name="tutoremail"
                  value={tutorDetails.tutoremail}
                  onChange={handleChange}
                />
                {errors.tutoremail && <p className="text-red-500">{errors.tutoremail}</p>}
              </div>
              <input
                id="phone"
                type="text"
                className="my-2 py-2 px-4 rounded-md bg-white text-gray-900 w-full outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Phone"
                name="phone"
                value={tutorDetails.phone}
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
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TutorBio;
