import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Course, clearCourseDetails, setSingleCourseDetails } from "../../../Slices/tutorSlice/courseSlice";
import { toast } from "sonner";
import { enrolledCourse } from "../../../Utils/config/axios.GetMethods";
import LoadingSpinner from "../../Common/LoadingSpinner";

function EnrolledCourses() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { student } = useSelector((state: any) => state.student);
    const studentId = student?._id;

    const { courseDetails } = useSelector((state: any) => state.course);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 8;
    const totalPages = Math.ceil(enrolledCourses.length / dataPerPage);
    const paginatedData = enrolledCourses.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handlePrev = () => {
        if (currentPage !== 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage !== totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                setLoading(true);
                const response = await enrolledCourse(studentId);
                if (response) {
                    setEnrolledCourses(response.data);
                }
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
                toast.error("Failed to fetch enrolled courses");
            } finally {
                setLoading(false);
            }
        };
        if (studentId) {
            fetchEnrolledCourses();
        }
    }, [studentId]);

    const handleSingleEnrollCourse = (course: Course) => {
        dispatch(clearCourseDetails());
        dispatch(setSingleCourseDetails(course));
        if (courseDetails) {
            navigate("/enrolled-singlecourse");
        } else {
            console.error("Error setting course details");
            toast.error("Error setting course details");
        }
    };

    if (loading) {
        return <LoadingSpinner />; // Display a spinner while loading
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 mx-10 gap-4">
                {paginatedData.map((course) => (
                    <div key={course._id} className="mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-3/4 mx-auto">
                        <Link to="/singlecourse" onClick={() => handleSingleEnrollCourse(course)}>
                            {course.courseId?.photo && course.courseId.photo.length > 0 ? (
                                <img
                                    className="rounded-t-lg w-full h-40 object-cover"
                                    src={course.courseId.photo[0]}
                                    alt={course.courseId.courseName}
                                />
                            ) : (
                                <div className="rounded-t-lg w-full h-40 bg-gray-200 flex items-center justify-center">
                                    <span>No Image</span>
                                </div>
                            )}
                        </Link>
                        <div className="p-5">
                            <Link to="/singlecourse" onClick={() => handleSingleEnrollCourse(course)}>
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-sky-700 dark:text-white">
                                    {course.courseId?.courseName || "No Course Name"}
                                </h5>
                            </Link>
                            <h3 className="mb-3 font-normal text-sky-600 dark:text-gray-400">
                                ₹{course.courseId?.courseFee || "N/A"}
                            </h3>
                            <div className="text-start">
                                <button
                                    onClick={() => handleSingleEnrollCourse(course)}
                                    className="inline-flex items-center px-6 py-1 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    View Course
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {enrolledCourses.length === 0 && !loading && (
                <div className="text-center py-8">
                    <span className="text-xl text-gray-700">No course available.</span>
                </div>
            )}
            <div className="mt-28">
                <ul className="flex space-x-3 justify-center mt-8">
                    <li
                        onClick={handlePrev}
                        className={`flex items-center justify-center shrink-0 cursor-pointer ${currentPage === 1 ? "bg-gray-300" : ""} w-9 h-8 rounded`}
                    >
                        {/* SVG for previous */}
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`flex items-center justify-center shrink-0 cursor-pointer text-sm font-bold ${
                                currentPage === i + 1 ? "bg-sky-600 text-white" : "text-[#333] bg-gray-300"
                            } w-9 h-8 rounded`}
                        >
                            {i + 1}
                        </li>
                    ))}
                    <li
                        onClick={handleNext}
                        className={`flex items-center justify-center shrink-0 cursor-pointer ${currentPage === totalPages ? "bg-gray-300" : ""} w-9 h-8 rounded`}
                    >
                        {/* SVG for next */}
                    </li>
                </ul>
            </div>
        </>
    );
}

export default EnrolledCourses;
