import React from "react";
import styles from "./Option.module.css";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "../Store/courseStore";

import introImg from "../Image/intro.png";
import frontendImg from "../Image/frontend.png";
import backendImg from "../Image/backend.png";

function Option() {
  const navigate = useNavigate();
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);

  const courses = [
    {
      id: "intro",
      name: "Introduction to Computer",
      image: introImg,
      path: "/learn",
    },
    {
      id: "frontend",
      name: "Frontend Development",
      image: frontendImg,
      path: "/frontend",
    },
    {
      id: "backend",
      name: "Backend Development",
      image: backendImg,
      path: "/backend",
    },
  ];

  const handleSelect = (course) => {
    setSelectedCourse(course);
    navigate(course.path);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <h1 className={styles.title}>Choose Your Course</h1>
        <div className={styles.cards}>
          {courses.map((course) => (
            <div
              key={course.id}
              className={styles.card}
              onClick={() => handleSelect(course)}
            >
              <img src={course.image} alt={course.name} className={styles.image} />
              <div className={styles.inner}>
                <h3 className={styles.cardTitle}>{course.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Option;
