import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

function Hero() {
  return (
    <section className="">
      <div className="bg-[url('https://i.imgur.com/jAXaawT.jpg')] h-screen bg-cover bg-center flex justify-items-center items-center">
        <div className="px-10 lg:px-32 xl:px-40">
          <h1 className="text-4xl font-semibold font-serif mb-6">
            <span className="text-red-500">Come teach with us</span> <br />
            <span>Become an instructor</span>
          </h1>
          <p className="text-lg max-w-md">
            Teach what you know and help learners explore their interests, gain new skills, and advance their careers.
          </p>
          {/* Using Link to navigate to the specified route */}
          <Link to="/tutor/addnewcourse">
            <button className="inline-block mt-10 px-10 py-3 bg-red-500 text-lg text-white font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
