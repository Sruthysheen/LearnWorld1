import React from 'react'

function Carousel() {
  return (
    <>
    <>
  {/* component */}
  <div className="flex items-center justify-center w-full h-full py-24 sm:py-8 px-4">
    {/*- more free and premium Tailwind CSS components at https://tailwinduikit.com/ -*/}
    <div className="w-full relative flex items-center justify-center">
      <button
        aria-label="slide backward"
        className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
        id="prev"
      >
        <svg
          className="dark:text-gray-900"
          width={8}
          height={14}
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1L1 7L7 13"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
        <div
          id="slider"
          className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700"
        >
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/fDngH9G/carosel-1.png"
              alt="black chair and white table"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 1
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/DWrGxX6/carosel-2.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/tCfVky2/carosel-3.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/rFsGfr5/carosel-4.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/fDngH9G/carosel-1.png"
              alt="black chair and white table"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/DWrGxX6/carosel-2.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/tCfVky2/carosel-3.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/rFsGfr5/carosel-4.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/fDngH9G/carosel-1.png"
              alt="black chair and white table"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/DWrGxX6/carosel-2.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/tCfVky2/carosel-3.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 relative w-full sm:w-auto">
            <img
              src="https://i.ibb.co/rFsGfr5/carosel-4.png"
              alt="sitting area"
              className="object-cover object-center w-full"
            />
            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
              <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">
                Catalog 2
              </h2>
              <div className="flex h-full items-end pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">
                  Minimal Interior
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        aria-label="slide forward"
        className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        id="next"
      >
        <svg
          className="dark:text-gray-900"
          width={8}
          height={14}
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L7 7L1 13"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</>

    
    
    </>
  )
}

export default Carousel