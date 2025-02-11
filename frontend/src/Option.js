import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { motion } from 'framer-motion'; // Framer Motion animation
import './Option.css';

// Import images directly from src/Image
import computerIntro from './Image/computer_intro.png';
import frontend from './Image/frontend.png';
import backend from './Image/backend.png';

// Array of course options
const options = [
  {
    id: 1,
    title: "Introduction to Computer",
    description: "Basics of computing for beginners.",
    image: computerIntro,
    link: "/home" // Destination route for this option
  },
  {
    id: 2,
    title: "Front-end Development",
    description: "Learn HTML, CSS, and JavaScript for creating user interfaces.",
    image: frontend,
    link: "/frontend"
  },
  {
    id: 3,
    title: "Back-end Development",
    description: "Master server-side programming with Node.js, Django, and more.",
    image: backend,
    link: "/backend"
  }
];

// Animation settings for Framer Motion
const cardVariants = {
  offscreen: {
    y: 100,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const Option = () => {
  const navigate = useNavigate();

  const handleCardClick = (link) => {
    navigate(link);
  };

  return (
    <div className="option-wrapper"> {/* ✅ TOP LEVEL WRAPPER */}
      <div className="option-body">
        <h1 className="option-main-title">What do you want to learn?</h1>

        <div className="option-cards-container">
          {options.map((option) => (
            <motion.div
              className="option-card"
              key={option.id}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                transition: { type: "spring", stiffness: 300 }
              }}
              onClick={() => handleCardClick(option.link)}
              style={{ cursor: 'pointer' }}
            >
              <div className="option-card-inner">
                <img src={option.image} alt={option.title} className="option-image" />
                <h2 className="option-title">{option.title}</h2>
                <p className="option-description">{option.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Option;