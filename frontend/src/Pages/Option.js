import React, { useEffect, useState } from "react";
import styles from "./Option.module.css";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "../Store/courseStore";
import { getProfile } from "../utils/api";

import introImg from "../Image/intro.png";
import frontendImg from "../Image/frontend.png";
import backendImg from "../Image/backend.png";

// Course options with backendId added explicitly
const courseOptions = [
  {
    id: 1,
    backendId: 1,
    key: "intro",
    name: "Introduction to Computer",
    image: introImg,
    path: "/learn",
  },
  {
    id: 2,
    backendId: 2,
    key: "frontend",
    name: "Frontend Development",
    image: frontendImg,
    path: "/learn",
  },
  {
    id: 3,
    backendId: 3,
    key: "backend",
    name: "Backend Development",
    image: backendImg,
    path: "/learn",
  },
];

function Option() {
  const navigate = useNavigate();
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);
  const [enrolledCourseTitles, setEnrolledCourseTitles] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        const enrolledTitles = profile.courses.map((course) =>
          course.title.toLowerCase()
        );
        setEnrolledCourseTitles(enrolledTitles);
      } catch (error) {
        console.error("❌ Failed to load profile courses:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSelect = (course) => {
    setSelectedCourse(course);
    navigate(course.path);
    const isEnrolled = enrolledCourseTitles.includes(course.name.toLowerCase());
    if (!isEnrolled) {
      navigate(`/level-select?courseId=${course.backendId}&courseKey=${course.key}`);
    } else {
      navigate(course.path);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <h1 className={styles.title}>Choose Your Course</h1>
        <div className={styles.cards}>
          {courseOptions.map((course) => {
            const isEnrolled = enrolledCourseTitles.includes(course.name.toLowerCase());
            return (
              <div
                key={course.key}
                className={`${styles.card} ${isEnrolled ? styles.enrolled : ""}`}
                onClick={() => handleSelect(course)}
              >
                <img
                  src={course.image}
                  alt={course.name}
                  className={styles.image}
                />
                <div className={styles.inner}>
                  <h3 className={styles.cardTitle}>{course.name}</h3>
                  {isEnrolled && <p className={styles.status}>Enrolled</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Option;
