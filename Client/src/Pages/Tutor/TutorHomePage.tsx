import React from 'react';
import TutorNavbar from '../../Components/Tutor/Header/TutorNavbar';
import TutorBio from '../../Components/Tutor/TutorProfile/TutorBio';
import Hero from '../../Components/Tutor/Home/Hero';
import Footer from '../../Components/Student/Home/Footer';

function TutorHomePage() {
  return (
    <div>
        <TutorNavbar/>
        <Hero/>
        <Footer/>
      
    </div>
  )
}

export default TutorHomePage