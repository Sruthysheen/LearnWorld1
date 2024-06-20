import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { format, parseISO } from 'date-fns';
import { Link } from "react-router-dom";
import { addToCart, addToWishlist } from "../../../Utils/config/axios.PostMethods";
import { toast } from "sonner";



function StudentSingleCourseView() {
  const {student} = useSelector((state:any) => state.student);
  console.log(student,"--------------------------this is student");
  const studentId = student._id;
  
  const { courseDetails } = useSelector((state: any) => state.course);
  console.log(courseDetails,"++++++++++++++++++++++++++++");
  

  const courseId = courseDetails._id;
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

  const handleAddToCart = async () => {
    console.log(studentId, "----------studentId");
    
    if (studentId) {
        try {
            const response: any = await addToCart(studentId, courseId);
            console.log(response, "..............");
            toast.success(response.data.message);
        } catch (error: any) {
            console.error("Error occurred while adding to cart", error);
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
        }
    } else {
        toast.error("Please log in to add the course to your cart.");
    }
}


  const handleAddToWishlist = async()=>{
    console.log(studentId,"----------studentId");
    
    if(studentId){
      try {
      const response:any=await addToWishlist(studentId,courseId)
      console.log(response,"..............");
      toast.success(response.data.message);
      

    } catch (error) {
      console.error("Error occur while adding to wishlist", error);
      toast.error("Course alredy existed in the wishlist")
    }}
    else {
      toast.error("Please log in to add the course to your cart.");
    }
  }



  return (
    <>
      <div className="flex flex-col md:flex-row items-center bg-cover bg-center overflow-auto"
           style={{ backgroundImage: 'url(/public/BG2.png)' }}>
        <div className="w-full md:w-1/2 py-5 md:py-10 px-5 md:px-10 text-center md:text-left text-sky-800 -mt-6">
          <h1 className="text-2xl md:text-5xl font-medium mb-4">{courseDetails.courseName}</h1>
          <p className="text-base md:text-md mb-4">{courseDetails.courseDescription}</p>
          <p className="text-base md:text-md mb-2 font-bold">Category: {courseDetails.category?.categoryname}</p>
          <p className="text-base md:text-md mb-2 font-bold">Course Fee: ₹{courseDetails.courseFee}</p>
          <p className="text-base md:text-md mb-2 font-bold">Course Duration: {courseDetails.courseDuration}</p>
          <p className="text-base md:text-md mb-2 font-bold">Last Updated: {format(parseISO(courseDetails.updatedAt), 'MMMM d, yyyy')}</p>
    <div className="mt-6">
    <h3 className="text-lg font-bold mb-2 text-sky-600 underline">Lessons for you...</h3>
    
    
    <ul className="max-h-96 overflow-y-auto">

        {courseDetails?.lessons && courseDetails.lessons.map((lesson: any, index: number) => (
            <li key={index} className="p-1 flex justify-between">
                <div className="flex-1">
                    <span className="text-sky-600">{index + 1}. {lesson.title}</span>
                </div>
                <div className="flex-1 text-sky-600">
                    {lesson.description.split('\n').join('<br/>')}
                </div>
            </li>
        ))}
    </ul>
</div>


          <div className="flex justify-center md:justify-start space-x-3 mt-4">
            <Link to="#" className="bg-sky-500 text-white py-3 px-6 rounded-full hover:bg-indigo-600"
             onClick={handleAddToCart}>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="currentColor"
              className="bi bi-cart"
              viewBox="0 0 16 16"
>
  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
</svg>
</Link>
            <Link to="#" className="bg-sky-500 text-white py-3 px-6 rounded-full hover:bg-indigo-600"
            onClick={handleAddToWishlist}><svg
  xmlns="http://www.w3.org/2000/svg"
  width={16}
  height={16}
  fill="currentColor"
  className="bi bi-heart"
  viewBox="0 0 16 16"
>
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
</svg></Link>
            {/* <Link to="#" className="bg-sky-500 text-white py-2 px-6 rounded-full hover:bg-indigo-600">Enroll Now</Link> */}
          </div>
        </div>
        <div className="w-full md:w-1/2 px-5 md:px-10">
          {courseDetails.lessons.length > 0 && courseDetails.lessons[0].video ? (
            <video ref={videoRef} controls className="media w-full object-cover rounded-xl" src={courseDetails.lessons[0].video} />
          ) : (
            <img src={courseDetails.photo} className="h-40 md:h-64 w-full object-cover rounded-xl" alt="Course Visual" />
          )}
          <p className="text-base md:text-md mb-4 text-sky-800 flex justify-center font-bold mt-4">Explore courses from experienced, real-world experts.</p>
          <p className="text-base md:text-md mb-4 text-sky-800 flex justify-center font-bold mt-4">Tutor : {courseDetails.tutor?.tutorname} </p>
        </div>
      </div>
    </>
  );
}

export default StudentSingleCourseView;