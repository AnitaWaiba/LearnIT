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
  const [showDashboard, setShowDashboard] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState([]);

  const cardRefs = useRef([]);
  const courseRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setShowDashboard(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const options = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = entry.target.dataset.index;
        if (entry.isIntersecting) {
          if (entry.target.dataset.type === 'card') {
            setVisibleCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          } else if (entry.target.dataset.type === 'course') {
            setVisibleCourses((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        } else {
          // For repeat animation
          if (entry.target.dataset.type === 'card') {
            setVisibleCards((prev) => prev.filter((i) => i !== index));
          } else if (entry.target.dataset.type === 'course') {
            setVisibleCourses((prev) => prev.filter((i) => i !== index));
          }
        }
      });
    }, options);

    cardRefs.current.forEach((el) => el && observer.observe(el));
    courseRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cards = [
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
    },
    {
      image: BasicsCourse,
      title: 'Computer Basics',
      rating: '⭐⭐⭐⭐⭐',
    },
    {
      image: WebCourse,
      title: 'Web Development',
      rating: '⭐⭐⭐⭐☆',
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
        <h1>LearnIT</h1>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <div className={styles.imageSection}>
            <img src={HomeImage} alt="Home" />
          </div>
          <div className={styles.textSection}>
            <h2 className={styles.headline}>
              Learn, Engage, and Achieve – The Joyful Path to Mastering a New Language!
            </h2>
            <div className={styles.buttons}>
              <button className={styles.getStartedBtn} onClick={() => navigate('/signup')}>GET STARTED</button>
              <button className={styles.loginBtn} onClick={() => navigate('/login')}>I ALREADY HAVE AN ACCOUNT</button>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Cards */}
      <section className={styles.features}>
        <h2>Why LearnIT?</h2>
        <div className={styles.featureCards}>
          {cards.map((card, index) => (
            <div
              key={index}
              data-type="card"
              data-index={index.toString()}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`${styles.card} ${visibleCards.includes(index.toString()) ? styles.visible : ''}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {card.icon}
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.steps}>
        <h2>How It Works</h2>
        <div className={styles.stepList}>
          <div className={styles.step}><span>1</span><p>Sign Up</p></div>
          <div className={styles.step}><span>2</span><p>Choose a Path</p></div>
          <div className={styles.step}><span>3</span><p>Learn & Play</p></div>
          <div className={styles.step}><span>4</span><p>Track Progress</p></div>
        </div>
      </section>

      {/* Course Cards */}
      <section className={styles.courses}>
        <h2>Popular Courses</h2>
        <div className={styles.courseCards}>
          {courses.map((course, index) => (
            <div
              key={index}
              data-type="course"
              data-index={index.toString()}
              ref={(el) => (courseRefs.current[index] = el)}
              className={`${styles.course} ${visibleCourses.includes(index.toString()) ? styles.visible : ''}`}
            >
              <img src={course.image} alt={course.title} />
              <h3>{course.title}</h3>
              <p>{course.rating}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/about">About Us</a>
          <a href="/terms">Terms</a>
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
