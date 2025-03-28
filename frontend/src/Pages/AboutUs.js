import React from 'react';
import styles from './AboutUs.module.css';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animation1 from '../Image/animation1.json';
import animation2 from '../Image/animation2.json';
import animation3 from '../Image/animation3.json';
import animation4 from '../Image/animation4.json';

const AboutUs = () => {
  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.link}>Home</Link> / <span>About Us</span>
      </div>

      {/* Section 1: Who We Are */}
      <section className={styles.section}>
        <div className={styles.animation}>
          <Lottie animationData={animation1} loop />
        </div>
        <div className={styles.text}>
          <h2>Who We Are</h2>
          <p>
            LearnIT is a gamified educational platform designed to make learning computer and programming basics fun,
            engaging, and rewarding. We’re developers and educators combining playful design with real learning.
          </p>
        </div>
      </section>

      {/* Section 2: Our Mission */}
      <section className={styles.sectionReverse}>
        <div className={styles.animation}>
          <Lottie animationData={animation2} loop />
        </div>
        <div className={styles.text}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to simplify tech education. We transform complex tech topics into interactive,
            bite-sized lessons and infuse gamification elements like streaks, XP, and challenges to keep
            learners motivated.
          </p>
        </div>
      </section>

      {/* Section 3: Our Vision */}
      <section className={styles.section}>
        <div className={styles.animation}>
          <Lottie animationData={animation3} loop />
        </div>
        <div className={styles.text}>
          <h2>Our Vision</h2>
          <p>
            We envision a world where everyone, regardless of background or experience, can learn tech through
            playful, personalized pathways. Education should feel like a game — exciting, rewarding, and within reach.
          </p>
        </div>
      </section>

      {/* Section 4: Why LearnIT */}
      <section className={styles.sectionReverse}>
        <div className={styles.animation}>
          <Lottie animationData={animation4} loop />
        </div>
        <div className={styles.text}>
          <h2>Why LearnIT?</h2>
          <p>
            LearnIT understands both code and classroom. Inspired by platforms like Duolingo, we blend educational
            theory with cutting-edge tools so you can master computer skills in a way that’s intuitive and enjoyable.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
