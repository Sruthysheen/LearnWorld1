import React from 'react'
import Navbar from '../../Components/Student/Header/Navbar'
import Hero from '../../Components/Student/Home/Hero'
import RecommendedForyouCard from '../../Components/Student/Home/Card/RecommendedForyouCard'
import Footer from '../../Components/Student/Home/Footer'
import Carousel from '../../Components/Student/Home/Card/Carousel'
import EnhanceCard from '../../Components/Student/Home/Card/EnhanceCard'

function HomePage() {
  return (
    <>
    <Navbar />
    <Hero />
    <EnhanceCard/>
    <RecommendedForyouCard />
     <Footer />
    </>
  )
}

export default HomePage