import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Option.module.css';

import computerIntro from '../Image/computer_intro.png';
import frontend from '../Image/frontend.png';
import backend from '../Image/backend.png';

import { useCourseStore } from '../Store/courseStore'; // ✅ Zustand store

const options = [
  {
    id: 1,
    title: "Introduction to Computer",
    description: "Basics of computing for beginners.",
    image: computerIntro,
    link: "/home",
    icon: computerIntro, // ✅ attach icon here for dropdown preview
  },
  {
    id: 2,
    title: "Front-end Development",
    description: "Learn HTML, CSS, and JavaScript for creating user interfaces.",
    image: frontend,
    link: "/frontend",
    icon: frontend,
  },
  {
    id: 3,
    title: "Back-end Development",
    description: "Master server-side programming with Node.js, Django, and more.",
    image: backend,
    link: "/backend",
    icon: backend,
  }
];

const cardVariants = {
  offscreen: { y: 100, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.4, duration: 0.8 }
  }
};

const Option = () => {
  const navigate = useNavigate();
  const setCurrentCourse = useCourseStore((state) => state.setCurrentCourse); // ✅ Zustand hook

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <h1 className={styles.title}>What do you want to learn?</h1>

        <div className={styles.cards}>
          {options.map((option) => (
            <motion.div
              key={option.id}
              className={styles.card}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                transition: { type: "spring", stiffness: 300 }
              }}
              onClick={() => {
                setCurrentCourse(option); // ✅ Save selected course globally
                navigate(option.link);    // ✅ Then navigate to the course page
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.inner}>
                <img src={option.image} alt={option.title} className={styles.image} />
                <h2 className={styles.cardTitle}>{option.title}</h2>
                <p className={styles.description}>{option.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Option;
