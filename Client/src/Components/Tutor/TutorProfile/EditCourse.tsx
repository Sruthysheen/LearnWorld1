import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {getAllCatagoryTutor } from "../../../Utils/config/axios.GetMethods";
import { setSingleCourseDetails } from "../../../Slices/tutorSlice/courseSlice";
import { editCourse } from "../../../Utils/config/axios.PostMethods";

interface CourseFormInterface {
  courseName: string;
  courseDescription: string;
  courseDuration: string;
  courseFee: number;
  photo: string;
  category: {
    _id(_id: any, arg1: string): unknown;
    categoryId: string;
    categoryname: string;
  };
}
interface CourseErrorInterface {
  courseName: string;
  courseDescription: string;
  courseDuration: string;
  courseFee: string;
  photo: string;
  category: string;
}

function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [img, setImg] = useState<File | null>(null);
  const [category, setCategory] = useState<string[]>([]);

  const { tutor } = useSelector((state: any) => state.tutor);
  const { courseDetails } = useSelector((state: any) => state.course);

  const courseId = courseDetails._id;
  console.log(courseId, "---------------------------------");

  const [courseInfo, setCourseInfo] = useState<CourseFormInterface>({
    courseName: "",
    courseDescription: "",
    courseDuration: "",
    courseFee: 0,
    photo: "",
    category: { 
        categoryId: "",
        categoryname: "",
        _id: function (_id: any, arg1: string): unknown {
            throw new Error("Function not implemented.");
        }
    },
  });

  const [errors, setErrors] = useState<CourseErrorInterface>({
    courseName: "",
    courseDescription: "",
    courseDuration: "",
    courseFee: "",
    photo: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await getAllCatagoryTutor();
        console.log(response.data, "----------category");

        if (response?.data) {
          const data = response?.data?.categoryDetails.map(
            (category: any) => category.categoryname
          );
          setCategory(data);
          console.log("Categories fetched and set:", data);
        }
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (courseDetails) {
      setCourseInfo({
        courseName: courseDetails.courseName,
        courseDescription: courseDetails.courseDescription,
        courseDuration: courseDetails.courseDuration,
        courseFee: courseDetails.courseFee,
        photo: courseDetails.photo || "",
        category: courseDetails.category,
      });
    }
  }, [courseDetails]);

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
        errorMsg = !value.trim() ? "Photo is required" : "";
        break;
      case "category":
        errorMsg = !value.trim() ? "Category is required" : "";
        break;
      case "tutorName":
        errorMsg = !value.trim() ? "Tutor name is required" : "";
        break;
      case "tutorEmail":
        errorMsg = !value.trim()
          ? "Email is required"
          : !/^\S+@\S+\.\S+$/.test(value)
          ? "Email is not valid"
          : "";
        break;
      case "phone":
        errorMsg = !value.trim()
          ? "Phone number is required"
          : !/^\d{10}$/.test(value)
          ? "Phone number must be 10 digits"
          : "";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseInfo((prevDetails) => ({ ...prevDetails, [name]: value }));
    validateInput(name, value);
    console.log(courseDetails, "+++++");
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImg(file);
  };

  const upload = async () => {
    console.log(courseInfo,"-------");
    
    console.log(courseDetails,courseDetails,category, "+++++++");
    if (Object.values(errors).every(error => error === '')) {
    const formData = new FormData();
    formData.append("courseName", courseInfo.courseName);
    formData.append("courseDescription", courseInfo.courseDescription);
    formData.append("courseDuration", courseInfo.courseDuration);
    formData.append("courseFee", String(courseInfo.courseFee));
    formData.append("category", JSON.stringify(courseInfo.category));
    formData.append("tutor", tutor._id);
    if (img) {
      formData.append("image", img, img.name);
    }

    try {
      const token = localStorage.getItem("Token");
      const response = await editCourse(formData, courseId);
      toast.success("Course edited successfully!");
      if (response.data.status) {
        console.log("SUCCES");
        const course = response.data.data;
        dispatch(setSingleCourseDetails(course));
        navigate("/tutor/getallcourse", { replace: true });
        toast.success("course Updated ");
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  } else {
    toast.error('Please fix the errors before submitting.');
  }
  };

  const changeCateName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(courseInfo.category._id,"in the on change");
    
    const categoryData = { categoryId: courseInfo.category._id, categoryname: e.target.value };
    const Data = JSON.parse(JSON.stringify(courseInfo))
    Data.category = categoryData
    console.log(categoryData,Data,"this is the nes vkjj");
    
    setCourseInfo(Data);
  };

  return (
    <>
      <>
        {/* component */}
        {/* Tailwind Play: https://play.tailwindcss.com/qIqvl7e7Ww  */}
        <div className="flex min-h-screen w-screen items-center justify-start bg-gradient-to-br from-sky-200 to-white">
          <div className="mx-auto w-full max-w-lg mt-[-3rem]">
            {" "}
            {/* Adjusted inline style here */}
            <h1 className="text-4xl font-medium text-sky-700">Create Course</h1>
            <form className="mt-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative z-0">
                  <input
                    type="text"
                    name="courseName"
                    className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={courseInfo.courseName}
                    onChange={handleChange}
                  />

                  {errors.courseName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseName}
                    </p>
                  )}
                  <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                    Course name
                  </label>
                </div>

                <div className="relative z-0 col-span-2">
                  <textarea
                    name="courseDescription"
                    rows={2}
                    className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={courseInfo.courseDescription}
                    onChange={handleChange}
                  />
                  <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                    Description
                  </label>
                  {errors.courseDescription && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseDescription}
                    </p>
                  )}
                </div>
                <div className="relative z-0">
                  {courseInfo.category ? (
                    <select
                      name="category"
                      value={courseInfo.category.categoryname}
                      onChange={changeCateName}
                      className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    >
                      {category.map((categoryName: string, index: number) => (
                        <option key={index} value={categoryName}>
                          {categoryName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{courseInfo.category}</span>
                  )}

                  <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                    Category
                  </label>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="relative z-0">
                  <input
                    type="text"
                    name="courseFee"
                    className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={courseInfo.courseFee}
                    onChange={handleChange}
                  />
                  <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                    Price
                  </label>
                  {errors.courseFee && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseFee}
                    </p>
                  )}
                </div>

                <div className="relative z-0">
                  <input
                    type="text"
                    name="courseDuration"
                    className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    value={courseInfo.courseDuration}
                    onChange={handleChange}
                  />
                  <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                    Duration
                  </label>
                  {errors.courseDuration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseDuration}
                    </p>
                  )}
                </div>

                {/* Add image upload field */}
                <div className="relative z-0">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleImage}
                    className="peer block w-full appearance-none border-0 border-b border-sky-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                  />
                  <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                    Upload Image
                  </label>
                </div>
              </div>
              {/* Add submit button */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  upload();
                }}
                className="mt-5 rounded-md bg-sky-600 px-10 py-2 text-white"
              >
                Update Course
              </button>
            </form>
          </div>
        </div>
      </>
    </>
  );
}

export default EditCourse;
