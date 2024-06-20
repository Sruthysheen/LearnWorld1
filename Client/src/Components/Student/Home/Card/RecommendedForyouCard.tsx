import React from 'react';

// Sample data array for courses
const courses = [
  {
    name: "HTML and CSS",
    tutor: "Pete Jepson",
    priceOriginal: "MVR 1000",
    priceSale: "MVR 700",
    image: "public/Html.png",
    rating: "4.5 Stars"
  },
  {
    name: "Advanced SQL",
    tutor: "Meera K S",
    priceOriginal: "MVR 1200",
    priceSale: "MVR 800",
    image: "public/Sql.webp",
    rating: "4.8 Stars"
  },
  {
    name: "Swift",
    tutor: "Anu Joseph",
    priceOriginal: "MVR 1100",
    priceSale: "MVR 650",
    image: "public/Swift1.jpg",
    rating: "4.9 Stars"
  },
  {
    name: "Big Data Technologies",
    tutor: "Teena Kurian",
    priceOriginal: "MVR 900",
    priceSale: "MVR 600",
    image: "Big-Data.jpg",
    rating: "4.7 Stars"
  },
  // Add more courses as needed
  {
    name: "React Native",
    tutor: "Alexander",
    priceOriginal: "MVR 900",
    priceSale: "MVR 600",
    image: "public/React.jpg",
    rating: "4.7 Stars"
  },
  {
    name: "JavaScript",
    tutor: "Rosel",
    priceOriginal: "MVR 900",
    priceSale: "MVR 600",
    image: "public/js.jpg",
    rating: "4.7 Stars"
  },
  {
    name: "Android Studio",
    tutor: "Joseph",
    priceOriginal: "MVR 900",
    priceSale: "MVR 600",
    image: "public/Android.webp",
    rating: "4.7 Stars"
  },
  {
    name: "Flutter",
    tutor: "Emanual",
    priceOriginal: "MVR 900",
    priceSale: "MVR 600",
    image: "public/Flutter.jpg",
    rating: "4.7 Stars"
  },
];

function RecommendedForyouCard() {
  return (
    <>
      <div className='mt-10 w-full h-10 flex justify-start items-center p-10 font-bold text-3xl text-sky-600'>
        Recommended For You
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-10 p-10 bg-gradient-to-br from-white px-2">

        {/* Mapping over the courses array */}
        {courses.map((course, index) => (
          <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-full">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }}>
              </div>
              <div className="p-3">
                <p className="font-bold text-sky-700 text-lg mb-1">
                  {course.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {course.tutor}
                </p>
                <div className="mt-3">
                  {course.rating}
                </div>
                <div className="flex mt-3 text-sm">
                  <p className="text-gray-400 line-through mr-2">
                    {course.priceOriginal}
                  </p>
                  <p className="font-bold text-green-500">
                    {course.priceSale}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}

export default RecommendedForyouCard;
