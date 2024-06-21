import React from 'react'

function HeroTutor() {
  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      

      {/* component */}
      {/* Hero Section */}
      <section className="text-black body-font">
        <div className="container mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
          <div className="lg:flex-grow flex flex-col md:items-start md:text-left mb-4 md:mb-0 items-center text-center">
            <h1 className="title-font tracking-wide sm:text-3xl md:text-4xl xl:text-5xl mb-4 font-bold text-sky-700 ">
            Master new skills with the guidance of our professional tutors.
            </h1>
           
          </div>
         
           
            <div className="w-full h- flex gap-2 justify-center items-center my-2 -mt-10">
              
              <img
                className="object-cover object-center rounded-xl"
                alt="hero"
                src="/public/Tutor31.PNG"
              />
            </div>
          </div>
       
      </section>
    </>
  )
}

export default HeroTutor
