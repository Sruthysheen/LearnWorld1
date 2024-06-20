import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  getAllCatagoryTutor,
  getAllCourses,
} from "../../../Utils/config/axios.GetMethods";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setLessons, setSingleCourseDetails } from "../../../Slices/tutorSlice/courseSlice";
import { addLesson } from "../../../Utils/config/axios.PostMethods";

interface LessonFormInterface {
  courseId: string;
  courseName: string;
  category: string;
  description: string;
  title: string;
  video: any;
}
function AddLesson() {
  interface Course {
    id: string;
    name: string;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const [course, setCourse] = useState<Course[]>([]);
  const [lesson, setLesson] = useState<LessonFormInterface>({
    courseId:"",
    courseName: "",
    category: "",
    description: "",
    title: "",
    video: "",
  });

  const { tutor } = useSelector((state: any) => state.tutor);

  const fetchCategory = async () => {
    try {
      const response: any = await getAllCatagoryTutor();
      if (response?.data) {
        const data = response?.data?.categoryDetails.map(
          (category: any) => category.categoryname
        );
        setCategory(data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchCourse = async () => {
    try {
      const response: any = await getAllCourses(tutor._id);
      if (response?.data) {
        const courseData = response?.data?.courseDetails.map((course: any) => ({
          id: course._id,
          name: course.courseName,
        }));
        console.log(courseData);
        
        setCourse(courseData);
      }
    } catch (error) {
      toast.error("failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchCourse();
  }, []);


  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "courseId") {
      const selectedCourse = course.find(c => c.id === value);
      setLesson(previousDetails => ({
        ...previousDetails,
        courseId: selectedCourse?.id || '',
        courseName: selectedCourse?.name || ''
      }));
    } else {
      setLesson(previousDetails => ({ ...previousDetails, [name]: value }));
    }
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null; 
    setVideoFile(file);
  };


 
  

  const upload = async () => {
    const formData = new FormData();
    formData.append("courseId", lesson.courseId);
    formData.append("category", lesson.category);
    formData.append("description", lesson.description);
    formData.append("title", String(lesson.title));
    if (videoFile) {
      formData.append("video", videoFile);
    }
    formData.append("tutor", tutor._id);

    try {
      console.log(localStorage.getItem("Token"), "000000000000000000000");
      const token = localStorage.getItem("Token");
      const response = await addLesson(formData)
      console.log(response,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
      
     
      if (response.status===200) {
        toast.success("Lesson added successfully!");
        console.log("SUCCES");
        const updatedCourse = response?.data;
        console.log(updatedCourse,'THIS IS COURSE-----',response);
        
        const lessons = updatedCourse.lessons;
        dispatch(setSingleCourseDetails(updatedCourse)); 
        dispatch(setLessons(lessons));
        navigate("/tutor/getallcourse", {replace: true});
        toast.success("Lesson Added");
      }
    } catch (error) {
      toast.error("Failed to add Lesson.");
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-medium text-sky-700 flex justify-center mt-9">
        Add New Lesson
      </h1>
      <div className="flex justify-center mt-6">
        <form className="w-full max-w-lg p-4">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0 md:w-1/2">
              <label
                className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Course Name
              </label>
              <select
                 className="appearance-none block w-full bg-sky-200 text-sky-700 border border-sky-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-sky-300"
                name="courseId"
                value={lesson.courseId}
                onChange={handleChange}
              >
                <option text-sky-500 value=""></option>
    {course && course.map((course: any, index: number) => (
      <option key={index} value={course.id}>
        {course.name}
      </option>
    ))}
              </select>
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
            <div className="w-full px-3 md:w-1/2">
              <label
                className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Category Name
              </label>
              <select
                className="appearance-none block w-full bg-sky-200 text-sky-700 border border-sky-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-sky-300"
                name="category"
                value={lesson.category}
                onChange={handleChange}
              >
                <option text-sky-500 value=""></option>
    {category && category.map((category: string, index: number) => (
      <option key={index} value={category}>
        {category}
      </option>
    ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Description
              </label>
              <textarea
                className="appearance-none block w-full bg-sky-200 text-sky-700 border border-sky-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-sky-300"
                placeholder="Description"
                name="description"
                value={lesson.description}
                onChange={handleChange}

              />
            </div>
            <div className="w-full px-3 mb-6 md:mb-0 md:w-1/2">
              <label
                className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Title
              </label>
              <input
                className="appearance-none block w-full bg-sky-200 text-sky-700 border border-sky-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="title"
                placeholder="Title"
                value={lesson.title}
                onChange={handleChange}
              />
            </div>
            <div className="w-full px-3 mb-6 md:mb-0 md:w-1/2">
              <label
                className="block uppercase tracking-wide text-sky-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Upload Video
              </label>
              <input
                type="file"
                accept="video/*"
                className="appearance-none block w-full bg-sky-200 text-sky-700 border border-sky-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="Video"
                onChange={handleVideo}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                upload();
              }}
              className="bg-sky-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Lesson
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddLesson;
