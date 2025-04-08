import React from 'react';
import { useCourseStore } from '../Store/courseStore';
import Home from './Introduction/Home';
import Frontend from './FrontendLearning/Frontend';
import Backend from './BackendLearning/Backend';

const LearnPage = () => {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  const renderCoursePage = () => {
    switch (selectedCourse.id) {
      case 'frontend':
        return <Frontend />;
      case 'backend':
        return <Backend />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      {renderCoursePage()}
    </div>
  );
};

export default LearnPage;
