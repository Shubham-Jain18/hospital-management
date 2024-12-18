import React, { useContext, useEffect } from 'react';
import './Section1.css';
import Navbar from '../navbar/navbar';
import banner from '../../assets/hero-banner.png';
import Footer from '../footer';
import AuthContext from '../../AuthContext';

const Section1 = () => {
  let {animate, setAnimate, should_animate} = useContext(AuthContext);
  useEffect(() => {
    if (should_animate.current && animate) {
      console.log(animate)
      if (animate) {
        const timer = setTimeout(() => {
          setAnimate(false);
          sessionStorage.setItem('animate', 'false');
        }, 1000);
        
        return () => clearTimeout(timer);
      }
      should_animate.current = false;
    }
  }, [setAnimate]);

  return (
    <div>
      <Navbar />
      <div className="section1_container">
        <div className="section1">
          <div className={`section1_left ${animate ? 'section1_left_animation' : ''}`}>
            <center><h1 className='section1_welcome'>Welcome to Heal</h1></center>
            <center><p className='section1_slogan'>One stop for all your medical needs!</p></center>
          </div>
          <div className={`section1_right ${animate ? 'section1_right_animation' : ''}`}>
            <img src={banner} alt="banner" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Section1;