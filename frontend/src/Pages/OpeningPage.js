import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OpeningPage.module.css';
import { FaGamepad, FaChartLine, FaQuestionCircle, FaMedal } from 'react-icons/fa';

import HomeImage from '../Image/hero.png';
import IntroCourse from '../Image/computer_intro.png';
import BasicsCourse from '../Image/frontend.png';
import WebCourse from '../Image/backend.png';

function OpeningPage() {
  const navigate = useNavigate();
  const featureRef = useRef(null);
  const courseRef = useRef(null);

  const [showDashboard, setShowDashboard] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [coursesVisible, setCoursesVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowDashboard(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === featureRef.current) {
            setFeaturesVisible(entry.isIntersecting);
          } else if (entry.target === courseRef.current) {
            setCoursesVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (featureRef.current) observer.observe(featureRef.current);
    if (courseRef.current) observer.observe(courseRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <FaGamepad size={48} color="#56C2D6" />,
      title: 'Gamified Learning',
      desc: 'Turn lessons into fun, game-like experiences that boost engagement.',
    },
    {
      icon: <FaChartLine size={48} color="#56C2D6" />,
      title: 'Track Progress',
      desc: 'Visualize your growth and celebrate each achievement.',
    },
    {
      icon: <FaQuestionCircle size={48} color="#56C2D6" />,
      title: 'Quizzes & Challenges',
      desc: 'Practice through interactive challenges and quizzes.',
    },
    {
      icon: <FaMedal size={48} color="#56C2D6" />,
      title: 'Badges & Rewards',
      desc: 'Earn rewards and unlock milestones as you learn.',
    },
  ];

  const courses = [
    {
      image: IntroCourse,
      title: 'Intro to Programming',
      rating: '⭐⭐⭐⭐☆',
      desc: 'Learn how to think like a programmer and write simple code step by step.',
    },
    {
      image: BasicsCourse,
      title: 'Computer Basics',
      rating: '⭐⭐⭐⭐⭐',
      desc: 'Understand computer history, shortcuts, components, and basic operations.',
    },
    {
      image: WebCourse,
      title: 'Web Development',
      rating: '⭐⭐⭐⭐☆',
      desc: 'Learn HTML, CSS, and JavaScript to build interactive websites.',
    },
  ];

  return (
    <div className={styles.page}>
      {showDashboard && (
        <div className={styles.floatingDashboard}>
          <h2 className={styles.dashboardLogo}>LearnIT</h2>
          <button className={styles.dashboardBtn} onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      )}

      <header className={styles.header}>
        <h1 className={styles.heroTitle}>LearnIT</h1>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <div className={styles.textSection}>
            <h2 className={styles.headline}>
              Learn, Engage, and Achieve – The Joyful Path to Mastering a New Language!
            </h2>
            <div className={styles.buttons}>
              <button className={styles.getStartedBtn} onClick={() => navigate('/signup')}>
                GET STARTED
              </button>
              <button className={styles.loginBtn} onClick={() => navigate('/login')}>
                I ALREADY HAVE AN ACCOUNT
              </button>
            </div>
          </div>
          <div className={styles.imageSection}>
            <img src={HomeImage} alt="Home" />
          </div>
        </div>
      </main>

      <section className={styles.features} ref={featureRef}>
        <h2>Why LearnIT?</h2>
        <div className={styles.featureCards}>
          {features.map((item, index) => (
            <div
              key={index}
              className={`${styles.card} ${featuresVisible ? styles.visible : ''}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.steps}>
        <h2>How It Works</h2>
        <div className={styles.stepList}>
          <div className={styles.animatedLine}></div>
          <div className={styles.pulseDot}></div>
          <div className={styles.step}><span>1</span><p>Sign Up</p></div>
          <div className={styles.step}><span>2</span><p>Choose a Path</p></div>
          <div className={styles.step}><span>3</span><p>Learn & Play</p></div>
          <div className={styles.step}><span>4</span><p>Track Progress</p></div>
        </div>
      </section>

      <section className={styles.courses} ref={courseRef}>
        <h2>Popular Courses</h2>
        <div className={styles.courseCards}>
          {courses.map((course, index) => (
            <div
              key={index}
              className={`${styles.course} ${coursesVisible ? styles.visible : ''}`}
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <img src={course.image} alt={course.title} />
              <h3>{course.title}</h3>
              <p className={styles.courseRating}>{course.rating}</p>
              <p className={styles.courseDesc}>{course.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/about">About Us</a>
          <a href="/terms">Terms</a>
          <a href="/help">Help Center</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
        </div>
        <div className={styles.socials}>
          <a href="/">📘</a>
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()} LearnIT. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default OpeningPage;
