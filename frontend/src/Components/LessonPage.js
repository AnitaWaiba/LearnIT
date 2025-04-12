import React, { useEffect, useState } from 'react';
import styles from './LessonPage.module.css';
import { getLessonDetailsWithQuestions } from '../utils/api';
import { useParams } from 'react-router-dom';

function LessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await getLessonDetailsWithQuestions(lessonId);
        console.log(response.data); // ✅ Shows lesson + questions
        setLesson(response.data);
      } catch (error) {
        console.error('Failed to load lesson:', error);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  if (!lesson) return <div>Loading lesson...</div>;

  return (
    <div className={styles.lessonPage}>
      <h1>{lesson.title}</h1>

      {lesson.description && (
        <div className={styles.lessonIntro}>
          <p>{lesson.description}</p>
        </div>
      )}

      <div className={styles.questionsContainer}>
        {lesson.questions.map((q, idx) => (
          <div key={q.id} className={styles.questionBlock}>
            {q.type === 'description' ? (
              <div className={styles.descriptionBlock}>
                📘 <strong>{q.text}</strong>
              </div>
            ) : (
              <>
                <h3>Q{idx + 1}: {q.text}</h3>
                {/* Later here you can render MCQ, Fill, Match etc. */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonPage;
