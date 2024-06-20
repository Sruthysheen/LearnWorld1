import React from 'react';

function EnhanceCard() {
  return (
    <>
      <div className='mt-10 w-full h-auto flex justify-center items-center p-5 md:p-10 font-bold text-xl md:text-3xl text-sky-600'>
        Enhance Your Professional Goals Through LearnWorld
      </div>
      <div className="flex flex-wrap justify-center gap-14 p-5 md:p-10 bg-white">

        {/* Repeatable Card Component */}
        {[
          {
            image: "public/CardImg4.jpg",
            title: "Expert Instruction: Empowering Excellence Through Expert Instruction."
          },
          {
            image: "public/CardImg3.png",
            title: "Video Tutorials : Dive into the World of Video Tutorials."
          },
          {
            image: "public/CardImg2.jpg",
            title: "Lifetime Access : Your Journey to Lifelong Learning Begins Here!"
          },
          {
            image: "public/certificate3.jpg",
            title: "Global Certificate: Elevate Your Skills, Anywhere in the World!"
          }
        ].map((card, index) => (
          <div key={index} className="w-full sm:w-56 h-72 bg-white rounded-md shadow-lg overflow-hidden">
            <div className="h-[175px]" style={{ backgroundImage: `url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
            <div className="p-3 flex flex-col justify-center items-start">
              <p className="font-bold text-sky-700 text-sm md:text-base leading-6 mb-1">
                {card.title}
              </p>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}

export default EnhanceCard;
