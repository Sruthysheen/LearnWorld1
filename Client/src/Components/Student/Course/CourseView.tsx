import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCatagoryStudent, getAllStudentCourses } from '../../../Utils/config/axios.GetMethods';
import { useSelector, useDispatch } from 'react-redux';
import { clearCourseDetails, setSingleCourseDetails } from '../../../Slices/tutorSlice/courseSlice';

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  courseDuration: string;
  category: { _id: string };
  courseFee: number;
  photo: string;
  tutor: string;
  createdAt: Date;
  updatedAt: Date;
}

function CourseView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courseInfo, setCourseInfo] = useState<Course[]>([]);
  const { student } = useSelector((state: any) => state.student);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [catagory, setCatagory]: any = useState([]);
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 8;

  useEffect(() => {
    fetchCourse();
    fetchCategory();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('s') || '';
    setSearch(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const totalPages = Math.ceil(courseInfo.length / dataPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [courseInfo.length, currentPage]);

  const fetchCourse = async () => {
    try {
      const response: any = await getAllStudentCourses();
      if (response?.data) {
        setCourseInfo(response.data.courseDetails);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again later.");
    }
  };

  const fetchCategory = async () => {
    try {
      const response: any = await getAllCatagoryStudent();
      if (response?.data) {
        setCatagory(response.data.categoryDetails);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again later.");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    const totalPages = Math.ceil(courseInfo.length / dataPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleReadMore = (item: any) => {
    dispatch(clearCourseDetails());
    dispatch(setSingleCourseDetails(item));
  };

  const handleClear = () => {
    setSelectedCat('');
    setSortOrder('');
    setSearch('');
  };

  const filteredCourses = courseInfo.filter(course => {
    if (search && !course.courseName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCat !== "" && (typeof course.category === "object" && course.category?._id !== selectedCat)) {
      return false;
    }
    return true;
  });

  const sortedCourses = filteredCourses.sort((a, b) => {
    if (sortOrder === "lowToHigh") {
      return a.courseFee - b.courseFee;
    } else if (sortOrder === "highToLow") {
      return b.courseFee - a.courseFee;
    } else {
      return 0;
    }
  });

  const paginatedFilteredData = sortedCourses.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
        <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="border border-sky-500 rounded-md p-1 text-sky-600 w-full sm:w-auto">
          <option value="">All Categories</option>
          {catagory.map((category: any, index: number) => (
            <option key={category._id} value={category._id}>
              {category.categoryname}
            </option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border border-sky-500 rounded-md p-1 text-sky-600 w-full sm:w-auto">
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>

        <button onClick={handleClear} className="bg-sky-600 text-white font-semibold py-1 px-4 rounded-md w-full sm:w-auto">Clear</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 mx-10 gap-4">
        {paginatedFilteredData.map((course, index) => (
          <div key={index} className="mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-3/4 mx-auto">
            <Link to="/singlecourse">
              <img
                className="rounded-t-lg w-full h-40 object-cover"
                src={course.photo}
                alt={course.courseName}
              />
            </Link>
            <div className="p-5">
              <Link to="/singlecourse">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-sky-700 dark:text-white">
                  {course.courseName}
                </h5>
              </Link>
              <h3 className="mb-3 font-normal text-sky-600 dark:text-gray-400">
                ₹{course.courseFee}
              </h3>
              <div className="text-start">
                <Link
                  to="/singlecourse"
                  onClick={() => handleReadMore(course)}
                  className="inline-flex items-center px-6 py-1 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <span className="text-xl text-gray-700">No course available.</span>
        </div>
      )}

      <div className="mt-28">
        <ul className="flex space-x-3 justify-center mt-8">
          <li
            onClick={handlePrev}
            className={`flex items-center justify-center shrink-0 cursor-pointer ${
              currentPage === 1 ? "bg-gray-300" : ""
            } w-9 h-8 rounded`}
          >
            &lt;
          </li>
          {Array.from({ length: Math.ceil(filteredCourses.length / dataPerPage) }, (_, i) => (
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
            className={`flex items-center justify-center shrink-0 cursor-pointer ${
              currentPage === Math.ceil(filteredCourses.length / dataPerPage) ? "bg-gray-300" : ""
            } w-9 h-8 rounded`}
          >
            &gt;
          </li>
        </ul>
      </div>
    </>
  );
}

export default CourseView;
