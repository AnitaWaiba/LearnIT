import React, { useEffect, useState } from "react";
import styles from "./Option.module.css";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "../Store/courseStore";
import { getProfile, enrollInCourse } from "../utils/api";

import introImg from "../Image/intro.png";
import frontendImg from "../Image/frontend.png";
import backendImg from "../Image/backend.png";

const courseOptions = [
  {
    id: 1,
    key: "intro",
    name: "Introduction to Computer",
    image: introImg,
    path: "/learn",
  },
  {
    id: 2,
    key: "frontend",
    name: "Frontend Development",
    image: frontendImg,
    path: "/frontend",
  },
  {
    id: 3,
    key: "backend",
    name: "Backend Development",
    image: backendImg,
    path: "/backend",
  },
];

function Option() {
  const navigate = useNavigate();
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);
  const [enrolledCourseTitles, setEnrolledCourseTitles] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await getProfile();
        const enrolled = response.data.courses.map((c) => c.title);
        setEnrolledCourseTitles(enrolled);
      } catch (error) {
        console.error("❌ Failed to load profile courses", error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleSelect = async (course) => {
    try {
      // Enroll in the course if not already enrolled
      if (!enrolledCourseTitles.includes(course.name)) {
        await enrollInCourse(course.id); // course.id must match the backend Course ID
        setEnrolledCourseTitles((prev) => [...prev, course.name]);
        console.log(`✅ Enrolled in ${course.name}`);
      }

      setSelectedCourse(course);
      navigate(course.path);
    } catch (error) {
      console.error(`❌ Failed to enroll in ${course.name}`, error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <h1 className={styles.title}>Choose Your Course</h1>
        <div className={styles.cards}>
          {courseOptions.map((course) => (
            <div
              key={course.key}
              className={`${styles.card} ${
                enrolledCourseTitles.includes(course.name) ? styles.enrolled : ""
              }`}
              onClick={() => handleSelect(course)}
            >
              <img src={course.image} alt={course.name} className={styles.image} />
              <div className={styles.inner}>
                <h3 className={styles.cardTitle}>{course.name}</h3>
                {enrolledCourseTitles.includes(course.name) && (
                  <p className={styles.status}>Enrolled</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Option;
