import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { format, parseISO } from 'date-fns';
import { fetchCategory,fetchStudentProgress,getRating } from "../../../Utils/config/axios.GetMethods";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { createConversation, postReview, studentProgress, } from "../../../Utils/config/axios.PostMethods";
import StarRating from "../Course/StarRating";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface RatingDocument {
    courseId: string| undefined;
    student: any;
    rating: number;
    studentId: {
      photo: string;
      studentname: string;
    };
    review: string;
    createdAt: Date;
  }

  interface WatchedLesson {
    lessonId: string;
    isCompleted: boolean;
    _id: string;
}


function SingleEnrolledCourse() {
    const { student } = useSelector((state: any) => state.student);
    const { courseDetails } = useSelector((state: any) => state.course);
    const [currentVideo, setCurrentVideo] = useState("");
    const [watchedLessons, setWatchedLessons] = useState<WatchedLesson[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const courseId = courseDetails.courseId._id;
    console.log(courseId,"..........................");
    
    const studentId = student._id;

    const [ratingDetails, setRatingDetails] = useState<RatingDocument[]>([]);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const handleRatingChange = async (newRating: any) => {
        setRating(newRating);
      };

      useEffect(()=>{
console.log(courseDetails,'THIS IS COURSE DETAILS');

      },[courseDetails])

      


const fetchMyRating = async () => {
    try {
      const courseId = courseDetails.courseId._id;
      const response = await getRating(courseId, studentId);
      if (response && response.data) {
        setRatingDetails(response.data.data);
        console.log("rating.......................", response.data.data);
       
        setRating(response.data.rating);
        setReview(response.data.review);

         
        
      }
    } catch (error) {
      console.error("Failed to fetch rating:", error);
    }
  };
  

  useEffect(() => {
    if (student) {
      fetchMyRating();
    }
  }, [courseId, studentId]);


//for posting student review and rating

const submitReview = async()=>{
    try {
        if (rating < 1) {
            return toast.error("select the rating star");
          }
          const courseId=courseDetails.courseId._id
          const response = await postReview(review, rating,courseId , studentId);
          console.log(response,">>>>>>>>>>>>>>>>>>>>>>>.");
          
        if(response){
            console.log(response.data, "rating and review");
          toast.success("Your rating added");
          setRating(0); 
          setReview(""); 
          fetchMyRating(); 
        }
    } catch (error) {
        console.error(error);
    }
}


const navigate =useNavigate()

    const fetchCategoryName = async (categoryId: string) => {
        try {
            const response = await fetchCategory(categoryId);
            const name = response?.data?.category[0]?.categoryname
            setCategoryName(name);
            
        } catch (error) {
            console.error("Error fetching category name:", error);
        }
    };

    const fetchProgress = async () => {
        try {
            if (!courseId || !studentId) return;
            const response = await fetchStudentProgress(courseId, studentId);
            console.log(response,'REWW');
            
            if (response && response.data.status) {
                setWatchedLessons(response?.data?.data?.watchedLessons);
            }
        } catch (error) {
            console.error("Failed to fetch progress:", error);
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

  

    const handleVideoEnd = async (lessonId: string) => {
        if (!watchedLessons.some(lesson => lesson.lessonId === lessonId)) {
            const updatedWatchedLessons:any = [...watchedLessons, { lessonId, isCompleted: true }];
            setWatchedLessons(updatedWatchedLessons);
            localStorage.setItem(`progress_${student._id}_${courseDetails?.courseId?._id}`, JSON.stringify(updatedWatchedLessons));
            try {
                await studentProgress(courseId, studentId, lessonId);
                console.log("Progress updated successfully.");
            } catch (error) {
                console.error("Failed to update progress:", error);
            }
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

    
    useEffect(() => {
        const savedProgress = localStorage.getItem(`progress_${student._id}_${courseDetails?.courseId?._id}`);
        if (savedProgress) {
            setWatchedLessons(JSON.parse(savedProgress));
        }
        if (courseDetails?.courseId?.category) {
            fetchCategoryName(courseDetails.courseId.category);
        }
        fetchProgress();
    }, [student._id, courseDetails]);

    


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

    const handleVideoCall = () => {
        const roomId = `${student._id}-${courseDetails.tutorId._id}-${courseDetails._id}`;
        navigate(`/room/${roomId}`);
    };

    const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
    
  const generateCertificate = () => {
    const certificateElement = document.querySelector("#certificate");
    if (certificateElement) {
      html2canvas(certificateElement as HTMLElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${student.studentname}_certificate.pdf`);
      });
    } else {
      console.error("Certificate element not found");
    }
  };
  
      

    return (
        <>
       
        {/* <Link to={`/student-chat/${courseDetails.tutorId._id}`}> */}
                <button className="fixed bottom-5 right-5 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-sky-600 focus:outline-none" onClick={handleConversation}>
                    <FontAwesomeIcon icon={faCommentDots} size="lg" />
                </button>
                <button className="fixed bottom-20 right-5 bg-sky-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 focus:outline-none" onClick={handleVideoCall}>
                    <FontAwesomeIcon icon={faVideo} size="lg" />
                </button>
            {/* </Link> */}
       
            <div className="flex flex-col md:flex-row items-center bg-cover bg-center overflow-auto"
                style={{ backgroundImage: 'url(/BG2.png)' }}>
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
                            {calculateProgress() === 100 && (
                <button
                  onClick={openModal}
                  className="mt-2 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                >
                  View Certificate
                </button>
              )}
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
                    <div className="flex justify-center mt-4">
    <Link to="/student-view-quiz">
        <button className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">View Quiz</button>
    </Link>
</div>
                    
                    
                </div>
                
                
            </div>

            

            <div className="mt-4 bg-white p-4 rounded-md shadow-md">
    <h4 className="text-lg font-semibold text-center text-sky-600">Your Rating and Review</h4>
    <div className="mt-4 flex flex-col items-center">
        <StarRating initialRating={rating} ratings={rating} onChange={handleRatingChange} />
        <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-1/2 p-2 mt-4 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Write your review here..."
        ></textarea>
        <button
            onClick={submitReview}
            className="mt-2 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
        >
            Submit Review
        </button>
    </div>

    

    <div className="max-w-2xl mx-auto py-8">
  <h2 className="text-2xl font-semibold mb-4 text-sky-800">Reviews and Ratings</h2>
  {ratingDetails.length > 0 &&
    ratingDetails.map((ratingDetail, index) => (
      <div key={index} className="border-b pb-4 mb-4">
        <div className="flex items-center mb-2">
          <img
            src={ratingDetail.studentId.photo}
            alt={ratingDetail.studentId.studentname}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{ratingDetail.studentId.studentname}</p>
            <StarRating initialRating={ratingDetail.rating} ratings={ratingDetail.rating} onChange={() => {}} />
          </div>
        </div>
        <p>{ratingDetail.review}</p>
        <p className="text-gray-500 text-sm">
          {format(parseISO(ratingDetail.createdAt.toString()), 'MMMM d, yyyy')}
        </p>
      </div>
    ))}
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

{isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative bg-white p-10 rounded-lg max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4 text-sky-800">Certificate of Completion</h2>
            <div id="certificate" className="bg-sky-100 p-6 rounded-lg text-sky-800">
                <img src="\Logo.png" alt="Logo" className="mx-auto mb-2" /> {/* Reduced margin-bottom here */}
                <h3 className="mb-1">LearnWorld</h3> {/* Adjust margin-bottom as needed here */}
                <h3 className="text-2xl font-bold">Certificate of Completion</h3>
                <p className="mt-4">This is to certify that</p>
                <h2 className="text-2xl font-bold uppercase mb-3 mt-3">{student.studentname}</h2>
                <p>has successfully completed the course</p>
                <h3 className="text-xl font-semibold mt-3">{courseDetails?.courseId?.courseName}</h3>
                <p className="mt-4">Date: {format(new Date(), 'MMMM d, yyyy')}</p>
                <p>Instructor: <span className="font-bold">{courseDetails?.tutorId?.tutorname}</span></p>
            </div>
            <button
              onClick={generateCertificate}
              className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
            >
              Download Certificate
            </button>
            <button
              onClick={closeModal}
              className="ml-2 mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
        </div>
    </div>
)}

            
        </>
    );
}

export default SingleEnrolledCourse;
