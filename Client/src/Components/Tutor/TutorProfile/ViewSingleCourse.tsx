import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { toast } from "sonner";
import { deleteLesson } from "../../../Utils/config/axios.DeleteMethod";
import { getSingleCourse } from "../../../Utils/config/axios.GetMethods";
import { useDispatch } from "react-redux";
import { clearCourseDetails, setSingleCourseDetails } from "../../../Slices/tutorSlice/courseSlice";


interface Category {
  categoryname: string;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
}

interface CourseDetail {
  _id: string;
  courseName: string;
  courseDescription: string;
  photo: string[];
  category: Category;
  courseFee: number;
  courseDuration: string;
  updatedAt: string;
  lessons: Lesson[];
}

function ViewSingleCourse() {
  const [singleInfo,setSingleInfo] = useState<any | null>(null)
  const [lessons,setLessons] = useState<Lesson[]>([])
  const { courseDetails } = useSelector((state:any) => state.course);
  console.log(courseDetails,"]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
  
  const courseId = courseDetails._id;
 const dispatch=useDispatch()
  
  

  const [currentVideo, setCurrentVideo] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleCloseVideo = () => {
    setCurrentVideo("");
  };

  useEffect(() => {
    if (currentVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [currentVideo]);

  const handleDelete = async (lessonId:string) => {
    try {
      const response = await deleteLesson(courseId, lessonId);
      if (response.status) {
        console.log(response.data.data,'-999999')
        toast.success("Lesson deleted successfully");
        dispatch(clearCourseDetails());
    dispatch(setSingleCourseDetails(response.data.data));

      } else {
        toast.error("Failed to delete lesson. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the lesson.");
      console.error("Error deleting lesson:", error);
    }
  };
  

  useEffect(()=>{
console.log(singleInfo,'----000')
  },[singleInfo])
  return (
    <>
      
      <div className="container flex flex-col px-6 py-4 mx-auto space-y-6 md:h-128 md:py-16 md:flex-row md:items-center md:space-x-6 -mt-4">
        {/* Media Top Section */}
        <div className="flex items-center justify-center w-full md:w-1/3">
          <div className="media-container" style={{ width: '320px', height: '320px', position: 'relative' }}>
            {currentVideo ? (
              <>
                <video ref={videoRef} controls className="media">
                  <source src={currentVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button onClick={handleCloseVideo} className="absolute top-0 right-0 text-white text-2xl px-4 py-2 bg-red-600 rounded-md">
                  &times;
                </button>
              </>
            ) : (
              <img
                className="media"
                src={courseDetails.photo}
                alt="Course Thumbnail"
              />
            )}
          </div>
        </div>
        {/* Course Details */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl font-medium tracking-wide text-sky-700 dark:text-white md:text-4xl">
              {courseDetails.courseName}
            </h1>
            <p className="mt-4 text-sky-700 dark:text-gray-300">
              {courseDetails.courseDescription}
            </p>
            {/* Additional Details */}
            <div className="text-sm font-bold tracking-wide text-sky-700 dark:text-white md:text-sm mt-4">
              <p className="mt-4">Category: {courseDetails.category?.categoryname}</p>
              <p className="mt-4">Course Fee: ₹{courseDetails.courseFee}</p>
              <p className="mt-4">Course Duration: {courseDetails.courseDuration}</p>
              <p className="mt-4">Last Updated: {format(parseISO(courseDetails.updatedAt), 'MMMM d, yyyy')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 flex justify-end mt-4 mr-4">
            <div className="bg-white dark:bg-gray-800 flex justify-end mt-4 mr-4">
  <Link
    to="/tutor/editcourse"
    className="block px-5 py-2 font-semibold text-center text-white transition-colors duration-200 transform bg-sky-600 rounded-md hover:bg-blue-400 mr-2"
  >
    Edit Course
  </Link>
  <Link
    to="/tutor/view-quiz" 
    className="block px-5 py-2 font-semibold text-center text-white transition-colors duration-200 transform bg-sky-600 rounded-md hover:bg-blue-400 mr-2"
  >
    View Quiz
  </Link>
  <Link
    to="/tutor/add-quiz" 
    className="block px-5 py-2 font-semibold text-center text-white transition-colors duration-200 transform bg-sky-600 rounded-md hover:bg-blue-400"
  >
    Add Quiz
  </Link>

</div>
      </div>
            {/* Lessons Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-sky-600">Lessons:</h3>
              <ul>
                {/* {singleInfo.lessons.length >0 &&  singleInfo.lessons.map((lesson:any, index:number) => ( */}
                   {courseDetails.lessons.length >0 &&  courseDetails.lessons.map((lesson:any, index:number) => (
                  <li key={lesson._id} className="mb-2 p-3 border border-sky-200 rounded-md">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sky-700"> {lesson.title}</div>
                      <div className="text-sky-700">{lesson.description}</div>
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handlePlayVideo(lesson.video)} className="px-2 py-1 bg-sky-500 text-white rounded-md">
                          Play
                        </button>
                        <Link to={`/tutor/editlesson/${lesson._id}`} className="px-2 py-1 bg-sky-500 text-white rounded-md">
                          Edit
                        </Link>
                        <button onClick={()=>handleDelete(lesson._id)} className="px-2 py-1 bg-sky-500 text-white rounded-md">
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewSingleCourse;
