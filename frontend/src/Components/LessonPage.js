import React, { useEffect, useState } from 'react';
import styles from './LessonPage.module.css';
import { getLessonDetailsWithQuestions } from '../utils/api';
import { useParams } from 'react-router-dom';

function LessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [unlockedIndex, setUnlockedIndex] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await getLessonDetailsWithQuestions(lessonId);
        setLesson(response.data);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (!lesson) return <div className={styles.loading}>Loading lesson...</div>;
  if (!lesson.questions || lesson.questions.length === 0) {
    return <div className={styles.noQuestions}>No questions available.</div>;
  }

  const question = lesson.questions[currentIndex];
  const total = lesson.questions.length;
  const isLast = currentIndex === total - 1;

  const handleOptionSelect = (index) => {
    if (!showResult) {
      setSelectedOption(index);
    }
  };

  const handleCheck = () => {
    if (question.type !== 'mcq' || selectedOption === null) return;

    const isCorrect = question.options[selectedOption].is_correct;
    setCorrect(isCorrect);
    setShowResult(true);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (isLast) {
      setCompleted(true);
    } else {
      setCurrentIndex(nextIndex);
      if (nextIndex > unlockedIndex) {
        setUnlockedIndex(nextIndex);
      }
    }
    setSelectedOption(null);
    setShowResult(false);
    setCorrect(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        ></div>
      </div>

      <div className={styles.card}>
        <h2>Read and respond</h2>
        <div className={styles.contextBox}>
          📘 {question.text}
        </div>

        {question.type === 'mcq' && (
          <div className={styles.options}>
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className={`${styles.optionBtn} ${selectedOption === idx ? styles.selected : ''} ${showResult && idx === selectedOption ? (correct ? styles.correct : styles.incorrect) : ''}`}
                onClick={() => handleOptionSelect(idx)}
                disabled={showResult}
              >
                {String.fromCharCode(65 + idx)}. {opt.text}
              </button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={styles.feedback}>
            {correct ? '✅ Correct!' : '❌ Incorrect'}
          </div>
        )}

        <div className={styles.actionRow}>
          {!showResult ? (
            <button
              className={styles.checkBtn}
              disabled={selectedOption === null}
              onClick={handleCheck}
            >
              Check
            </button>
          ) : (
            <button className={styles.nextBtn} onClick={handleNext}>
              {isLast ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      </div>

      <div className={styles.navigation}>
        {lesson.questions.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.navBtn} ${idx === currentIndex ? styles.activeNav : ''}`}
            disabled={idx > unlockedIndex}
            onClick={() => setCurrentIndex(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {completed && (
        <div className={styles.completeBox}>
          🎉 You’ve completed the lesson: <strong>{lesson.title}</strong>!
        </div>
      )}
    </div>
  );
}

export default LessonPage;
