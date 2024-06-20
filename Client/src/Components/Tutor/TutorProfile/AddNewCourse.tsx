import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { getAllCatagoryTutor } from "../../../Utils/config/axios.GetMethods";
import { setSingleCourseDetails } from "../../../Slices/tutorSlice/courseSlice";
import { addNewCourse as addNewCourseApi } from "../../../Utils/config/axios.PostMethods";

interface CourseFormInterface {
  courseName: string;
  courseDescription: string;
  courseDuration: string;
  courseFee: number;
  photo: string;
  category: string;
}

interface CourseErrorInterface {
  courseName: string;
  courseDescription: string;
  courseDuration: string;
  courseFee: string;
  photo: string;
  category: string;
}

function AddNewCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<CourseErrorInterface>({
    courseName: "",
    courseDescription: "",
    courseDuration: "",
    courseFee: "",
    photo: "",
    category: "",
  });

  const [img, setImg] = useState<File | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const { tutor } = useSelector((state: any) => state.tutor);

  const [courseDetails, setCourseDetails] = useState<CourseFormInterface>({
    courseName: "",
    courseDescription: "",
    courseDuration: "",
    courseFee: 0,
    photo: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await getAllCatagoryTutor();
        if (response?.data) {
          const data = response?.data?.categoryDetails.map((category: any) => category.categoryname);
          setCategory(data);
        }
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const validateInput = (name: string, value: any) => {
    let errorMsg = "";
    switch (name) {
      case "courseName":
        errorMsg = !value.trim() ? "Course name is required" : "";
        break;
      case "courseDescription":
        errorMsg = !value.trim() ? "Course description is required" : "";
        break;
      case "courseDuration":
        errorMsg = !value.trim() ? "Course duration is required" : "";
        break;
      case "courseFee":
        errorMsg = value <= 0 ? "Course fee must be greater than 0" : "";
        break;
      case "photo":
        errorMsg = !img ? "Photo is required" : "";
        break;
      case "category":
        errorMsg = !value.trim() ? "Category is required" : "";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    validateInput(name, value);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImg(file);
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(courseDetails).forEach((fieldName) => {
      const value = courseDetails[fieldName as keyof CourseFormInterface];
      const fieldIsValid = validateInput(fieldName, value);
      if (!fieldIsValid) {
        isValid = false;
        console.log(`Validation failed for ${fieldName}`); // Log the field with the error
      }
    });
    return isValid;
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("courseName", courseDetails.courseName);
    formData.append("courseDescription", courseDetails.courseDescription);
    formData.append("courseDuration", courseDetails.courseDuration);
    formData.append("courseFee", String(courseDetails.courseFee));
    formData.append("category", courseDetails.category);
    formData.append("tutor", tutor._id);
    if (img) {
      formData.append("image", img, img.name);
    }
    try {
      const response = await addNewCourseApi(formData);
      if (response.data.status) {
        const course = response.data.data;
        dispatch(setSingleCourseDetails(course));
        navigate("/tutor/getallcourse", { replace: true });
        toast.success("Course Added");
      }
    } catch (error) {
      toast.error("Failed to add course.");
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-start bg-gradient-to-br from-sky-200 to-white">
      <div className="mx-auto w-full max-w-lg mt-[-3rem]">
        <h1 className="text-4xl font-medium text-sky-700">Create Course</h1>
        <form className="mt-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative z-0">
              <input
                type="text"
                name="courseName"
                className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={courseDetails.courseName}
                onChange={handleChange}
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-sky-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                Course name
              </label>
              {errors.courseName && <p className="text-red-500 text-xs mt-1">{errors.courseName}</p>}
            </div>
            <div className="relative z-0 col-span-2">
              <textarea
                name="courseDescription"
                rows={2}
                className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={courseDetails.courseDescription}
                onChange={handleChange}
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-sky-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                Description
              </label>
              {errors.courseDescription && <p className="text-red-500 text-xs mt-1">{errors.courseDescription}</p>}
            </div>
            <div className="relative z-0">
              <select
                name="category"
                value={courseDetails.category}
                onChange={handleChange}
                className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-sky-600 focus:border-blue-600 focus:outline-none focus:ring-0"
              >
                <option value=""></option>
                {category && category.map((category: string, index: number) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-sky-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                Category
              </label>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div className="relative z-0">
              <input
                type="number"
                name="courseFee"
                className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={courseDetails.courseFee}
                onChange={handleChange}
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-sky-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                Price
              </label>
              {errors.courseFee && <p className="text-red-500 text-xs mt-1">{errors.courseFee}</p>}
            </div>
            <div className="relative z-0">
              <input
                type="text"
                name="courseDuration"
                className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={courseDetails.courseDuration}
                onChange={handleChange}
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-sky-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                Duration
              </label>
              {errors.courseDuration && <p className="text-red-500 text-xs mt-1">{errors.courseDuration}</p>}
            </div>
            <div className="relative z-0">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleImage}
                className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-sky-600 focus:border-blue-600 focus:outline-none focus:ring-0"
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-sky-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                Upload Image
              </label>
              {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
            </div>
          </div>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (validateForm()) {
                upload();
              } else {
                toast.error("Please add details.");
              }
            }}
            className="mt-5 rounded-md bg-sky-600 px-10 py-2 text-white"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewCourse;
