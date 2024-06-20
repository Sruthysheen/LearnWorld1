import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { format, parseISO } from 'date-fns';
import { fetchCategory } from "../../../Utils/config/axios.GetMethods";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { createConversation } from "../../../Utils/config/axios.PostMethods";


function SingleEnrolledCourse() {
    const { student } = useSelector((state: any) => state.student);
    const { courseDetails } = useSelector((state: any) => state.course);
    const [currentVideo, setCurrentVideo] = useState("");
    const [watchedLessons, setWatchedLessons] = useState<string[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);


const navigate =useNavigate()


    useEffect(() => {
        const savedProgress = localStorage.getItem(`progress_${student._id}_${courseDetails?.courseId?._id}`);
        if (savedProgress) {
            setWatchedLessons(JSON.parse(savedProgress));
        }
        if (courseDetails?.courseId?.category) {
            fetchCategoryName(courseDetails.courseId.category);
        }
    }, [student._id, courseDetails]);


    const fetchCategoryName = async (categoryId: string) => {
        try {
            const response = await fetchCategory(categoryId);
            const name = response?.data?.category[0]?.categoryname
            setCategoryName(name);
            
        } catch (error) {
            console.error("Error fetching category name:", error);
        }
    };

    const handlePlayVideo = (videoUrl: string) => {
        setCurrentVideo(videoUrl);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    const handleCloseVideo = () => {
        setCurrentVideo("");
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleVideoEnd = (lessonId: string) => {
        if (!watchedLessons.includes(lessonId)) {
            const updatedWatchedLessons = [...watchedLessons, lessonId];
            setWatchedLessons(updatedWatchedLessons);
            localStorage.setItem(`progress_${student._id}_${courseDetails?.courseId?._id}`, JSON.stringify(updatedWatchedLessons));
        }
    };

    useEffect(() => {
        if (currentVideo && videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.error("Error playing video:", error);
            });
        }
    }, [currentVideo]);

    const calculateProgress = () => {
        const totalLessons = courseDetails?.courseId?.lessons?.length || 0;
        return totalLessons > 0 ? (watchedLessons.length / totalLessons) * 100 : 0;
    };



    const handleConversation=async()=>{
        const data={
            userId:student._id,
            tutorId:courseDetails?.tutorId?._id
        }
        console.log(data,'++++++DATA');


        const response= await createConversation(data)
        if(response.data.status){
           
               const tutorId=courseDetails?.tutorId?._id 
               const chatId=response.data.data._id
            
            
            navigate(`/student-chat/${tutorId}/${chatId}`)
        }else{
            toast.error(response.data.message)
        }
    }

    return (
        <>
        {/* <Link to={`/student-chat/${courseDetails.tutorId._id}`}> */}
                <button className="fixed bottom-5 right-5 bg-sky-500 text-white rounded-full p-4 shadow-lg hover:bg-sky-600 focus:outline-none" onClick={handleConversation}>
                    <FontAwesomeIcon icon={faCommentDots} size="lg" />
                </button>
            {/* </Link> */}
       
            <div className="flex flex-col md:flex-row items-center bg-cover bg-center overflow-auto"
                style={{ backgroundImage: 'url(/public/BG2.png)' }}>
                <div className="w-full md:w-1/2 py-5 md:py-10 px-5 md:px-10 text-center md:text-left text-sky-800">
                    <h1 className="text-2xl md:text-5xl font-medium mb-4">{courseDetails?.courseId?.courseName}</h1>
                    <p className="text-base md:text-md mb-4">{courseDetails?.courseId?.courseDescription}</p>
                    <p className="text-base md:text-md mb-2 font-bold">Category: {categoryName}</p>
                    <p className="text-base md:text-md mb-2 font-bold">Course Fee: ₹{courseDetails?.courseId?.courseFee}</p>
                    <p className="text-base md:text-md mb-2 font-bold">Course Duration: {courseDetails?.courseId?.courseDuration}</p>
                    <p className="text-base md:text-md mb-2 font-bold">Last Updated: {courseDetails?.courseId?.updatedAt ? format(parseISO(courseDetails.courseId.updatedAt), 'MMMM d, yyyy') : ''}</p>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-sky-600">Lessons for you...</h3>
                        <ul className="max-h-96 overflow-y-auto">
                            {courseDetails?.courseId?.lessons && courseDetails.courseId.lessons.map((lesson: any, index: number) => (
                                <li key={index} className={`mb-2 p-3 border border-sky-300 rounded-md ${watchedLessons.includes(lesson._id) ? 'bg-green-100' : ''}`}>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-sky-700">{lesson.title}</div>
                                        <div className="text-sky-700">{lesson.description}</div>
                                        <div className="flex justify-center items-center gap-4">
                                            <button onClick={() => handlePlayVideo(lesson.video)} className="px-3 py-1 bg-sky-500 text-white rounded-md">
                                                Play
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-sky-600">Course Progress</h4>
                            <div className="mt-3 w-full bg-indigo-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                            </div>
                            <p className="text-sky-600 mt-2">{Math.round(calculateProgress())}% completed</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-5 md:px-10">
                    {courseDetails?.courseId?.photo?.[0] && (
                        <img
                            src={courseDetails.courseId.photo[0]}
                            className="h-40 md:h-64 w-full object-cover rounded-xl"
                            alt="Course Visual"
                        />
                    )}
                    <p className="text-base md:text-md mb-4 text-sky-800 flex justify-center font-bold mt-4">Explore courses from experienced, real-world experts.</p>
                    <p className="text-base md:text-md mb-4 text-sky-800 flex justify-center font-bold mt-4">Tutor: {courseDetails?.tutorId?.tutorname}</p>
                </div>
            </div>

            {currentVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-indigo-100 p-4 rounded-lg max-w-3xl mx-auto">
                        <button onClick={handleCloseVideo} className="absolute -top-1 right-1 text-sky-500">
                            Close
                        </button>
                        <video ref={videoRef} controls className="w-full h-auto" onEnded={() => handleVideoEnd(courseDetails.courseId.lessons.find((lesson: any) => lesson.video === currentVideo)?._id)}>
                            <source src={currentVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
              
            
        </>
    );
}

export default SingleEnrolledCourse;
