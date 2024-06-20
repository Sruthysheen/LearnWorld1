import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { studentTutorListing, adminListAllTutors } from '../../../Utils/config/axios.GetMethods';

function TutorList() {
  interface Tutor {
    _id: any;
    tutorname: string;
    tutoremail: string;
    phone: string;
    password: string;
    isBlocked: boolean;
    photo: string;
  }

  const [data, setData] = useState<Tutor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 6;
  const lastIndex = dataPerPage * currentPage;
  const firstIndex = lastIndex - dataPerPage;
  const page = Math.ceil(data.length / dataPerPage);
  const paginateddata = data.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page !== currentPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await studentTutorListing();
        setData(result.data.tutorDetails);
      } catch (error) {
        console.error("Error during admin get all tutors:", error);
      }
    };

    fetchData();
  }, [adminListAllTutors]);

  return (
    <div className="p-6">
      <h1 className="text-center font-medium text-2xl text-sky-700">Meet Our Mentors</h1>
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
        <div className="container max-w-7xl mx-auto px-4 py-8" style={{ cursor: "auto" }}>
          <div className="flex flex-wrap">
            {paginateddata.map((tutor, index) => (
              <div key={index} className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img
                    alt="image not available"
                    src={tutor.photo}
                    className="rounded-xl shadow-lg max-w-full h-auto align-middle border-none"
                  />
                  <div className="pt-6 text-center">
                    <h1 className="text-sky-700 text-xl font-serif font-bold leading-normal mt-0 mb-2">
                      {tutor.tutorname}
                    </h1>
                    <p className="text-sky-700 text-base font-light leading-relaxed mt-0 mb-4">
                      {tutor.tutoremail}
                    </p>
                    <div className="flex items-center justify-center">
                      <button className="flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider transition-all duration-300 rounded-full w-10 h-10 p-0 text-xs bg-transparent text-light-blue-500 hover:bg-light-blue-50 hover:text-light-blue-700 active:bg-light-blue-100">
                        <i className="fab fa-twitter text-lg" />
                      </button>
                      <button className="flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider transition-all duration-300 rounded-full w-10 h-10 p-0 text-xs bg-transparent text-blue-500 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100">
                        <i className="fab fa-facebook-f text-lg" />
                      </button>
                      <button className="flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider transition-all duration-300 rounded-full w-10 h-10 p-0 text-xs bg-transparent text-pink-500 hover:bg-pink-50 hover:text-pink-700 active:bg-pink-100">
                        <i className="fab fa-dribbble text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <nav className="flex justify-center items-center rounded-lg space-x-2">
            <span
              className="text-gray-500 hover:text-teal-600 p-4 inline-flex items-center gap-2 rounded-md cursor-pointer"
              onClick={handlePrev}
            >
              <span aria-hidden="true">«</span>
              <span className="sr-only">Previous</span>
            </span>
            {Array.from({ length: page }, (_, index) => (
              <span
                key={index + 1}
                className={`w-10 h-10 ${
                  currentPage === index + 1
                    ? "bg-sky-600 text-white"
                    : "text-gray-500 hover:text-teal-600"
                } p-4 inline-flex items-center text-sm font-medium rounded-md cursor-pointer`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </span>
            ))}
            <span
              className="text-gray-500 hover:text-teal-600 p-4 inline-flex items-center gap-2 rounded-md cursor-pointer"
              onClick={handleNext}
            >
              <span className="sr-only">Next</span>
              <span aria-hidden="true">»</span>
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default TutorList;
