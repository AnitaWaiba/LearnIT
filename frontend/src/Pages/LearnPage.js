import React from 'react';
import { useCourseStore } from '../Store/courseStore';

function LearnPage() {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  const renderContent = () => {
    switch (selectedCourse) {
      case 'frontend':
        return <div>🚀 Learn Frontend Development</div>;
      case 'backend':
        return <div>🔧 Learn Backend Development</div>;
      case 'intro':
      default:
        return <div>💡 Learn Introduction to Computer</div>;
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Learning: {selectedCourse}</h2>
      {renderContent()}
    </div>
  );
}

export default LearnPage;
