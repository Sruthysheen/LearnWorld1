import React from 'react'
import { Link } from 'react-router-dom'
import { axiosTest } from '../../../Utils/config/axios.GetMethods'

function Hero() {
  return (
   <>
  <section className=" mt-  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
  <div className="  mx-auto max-w-7xl px-4  sm:px-6  lg:px-8  flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row  items-center">
    <div className="sm:text-center lg:text-left">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
        <span className="block xl:inline">Courses to enrich your</span>
        <span className="block text-sky-600 xl:inline">Future</span>
      </h1>
      <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
      Where can learning take you? Discover the possibilities with a course.
      </p>
      {/* Button Section */}
      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
        <div className="rounded-md shadow">
          <Link
            to="/login"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-lg md:px-10"
          >
            Get started
          </Link>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-3">
          <div
          onClick={axiosTest}
           
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
          >
            Live demo
          </div>
        </div>
      </div>
      {/* End of Button Section */}
    </div>
    {/*   Image Section     */}
    <div className="lg:inset-y-0 lg:right-0 lg:w-1/2  ">
      <img
        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
        src="public/man2.png"
        alt=""
      />
    </div>
    {/*   End of Image Section     */}
  </div>
</section>

   </>
  )
}

export default Hero
