import React, { useEffect, useState } from 'react';
import styles from './LessonPage.module.css';
import { getLessonBlocks } from '../utils/api';
import { markLessonCompleted } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function LessonPage() {
  const { lessonId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await getLessonBlocks(lessonId);
        setLesson(response.lesson);
        setBlocks(response.blocks);
      } catch (error) {
        console.error('Failed to fetch lesson blocks:', error);
      }
    };
    fetchBlocks();
  }, [lessonId]);

  const currentBlock = blocks[currentIndex];
  const isLastBlock = currentIndex === blocks.length - 1;

  const handleOptionSelect = (index) => {
    if (!showResult) {
      setSelectedOption(index);
    }
  };

  const handleCheck = () => {
    if (!currentBlock?.question) return;

    if (currentBlock.question.type === 'mcq') {
      const isCorrect = currentBlock.question.options[selectedOption]?.is_correct;
      setCorrect(isCorrect);
    }

    if (currentBlock.question.type === 'fill') {
      const correctAnswer = currentBlock.question.options[0]?.text?.trim().toLowerCase();
      const userAnswer = userInput.trim().toLowerCase();
      setCorrect(userAnswer === correctAnswer);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastBlock) {
      setCompleted(true);
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null);
    setUserInput('');
    setShowResult(false);
    setCorrect(null);
  };

  if (!lesson || blocks.length === 0) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentIndex + 1) / blocks.length) * 100}%` }}
        />
      </div>

      {/* Lesson Card */}
      <div className={styles.card}>
        <h2>{lesson.title}</h2>

        {/* Text Block */}
        {currentBlock.type === 'text' && (
          <>
            <div className={styles.paragraphBlock}>
              {currentBlock.text.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
            <div className={styles.actionRow}>
              <button className={styles.nextBtn} onClick={handleNext}>
                {isLastBlock ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}

        {/* Question Block */}
        {currentBlock.type === 'question' && currentBlock.question && (
          <>
            <div className={styles.contextBox}>🧠 {currentBlock.question.text}</div>

            {/* MCQ */}
            {currentBlock.question.type === 'mcq' && (
              <div className={styles.options}>
                {currentBlock.question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`${styles.optionBtn} ${
                      selectedOption === idx ? styles.selected : ''
                    } ${showResult && selectedOption === idx
                      ? correct ? styles.correct : styles.incorrect : ''
                    }`}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showResult}
                  >
                    {String.fromCharCode(65 + idx)}. {opt.text}
                  </button>
                ))}
              </div>
            )}

            {/* Fill in the Blank */}
            {currentBlock.question.type === 'fill' && (
              <div className={styles.fillContainer}>
                <input
                  type="text"
                  className={styles.fillInput}
                  value={userInput}
                  placeholder="Type your answer..."
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={showResult}
                />
              </div>
            )}

            {/* Matching (Optional UI - Not implemented fully here) */}
            {currentBlock.question.type === 'match' && (
              <div className={styles.matchNote}>
                Matching questions are not yet interactive.
              </div>
            )}

            {/* Result Feedback */}
            {showResult && (
              <div className={styles.feedback}>
                {correct ? '✅ Correct!' : '❌ Incorrect'}
              </div>
            )}

            <div className={styles.actionRow}>
              {!showResult ? (
                <>
                  <button className={styles.skipBtn} onClick={handleNext}>Skip</button>
                  <button
                    className={styles.checkBtn}
                    disabled={
                      (currentBlock.question.type === 'mcq' && selectedOption === null) ||
                      (currentBlock.question.type === 'fill' && userInput.trim() === '')
                    }
                    onClick={handleCheck}
                  >
                    Check
                  </button>
                </>
              ) : (
                <button className={styles.nextBtn} onClick={handleNext}>
                  {isLastBlock ? 'Finish' : 'Next'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Completion Message */}
      {completed && (
        <div className={styles.completionOverlay}>
          <div className={styles.completionBox}>
            <h2>🎉 Lesson Completed!</h2>
            <p>You’ve successfully completed <strong>{lesson.title}</strong>.</p>
            <button onClick={() => setCompleted(false)} className={styles.closeBtn}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonPage;
