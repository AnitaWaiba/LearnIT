import React, { useEffect, useState } from 'react';
import styles from './LessonPage.module.css';
import {
  getLessonBlocks,
  markLessonCompleted,
  submitAnswer,
  getProfile,
} from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../Store/profileStore';

function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const updateProfile = useProfileStore((s) => s.setFromProfile);  

  const [blocks, setBlocks] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState([]);
  const [shuffledRightOptions, setShuffledRightOptions] = useState([]);
  const [wrongPairs, setWrongPairs] = useState([]);

  const pairColors = ['matchPairA', 'matchPairB', 'matchPairC', 'matchPairD', 'matchPairE'];
  const currentBlock = blocks[currentIndex];
  const isLastBlock = currentIndex === blocks.length - 1;

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await getLessonBlocks(lessonId);
        setLesson(res.lesson);
        setBlocks(res.blocks);
      } catch (err) {
        console.error('Failed to load lesson:', err);
      }
    };
    fetchBlocks();
  }, [lessonId]);

  useEffect(() => {
    if (currentBlock?.question?.type === 'match') {
      const rightOptions = currentBlock.question.options.map(opt => opt.match_pair);
      setShuffledRightOptions([...rightOptions].sort(() => Math.random() - 0.5));
      setMatches([]);
      setWrongPairs([]);
      setSelectedLeft(null);
      setShowResult(false);
      setCorrect(null);
    }
  }, [currentBlock]);

  const refreshProfile = async () => {
    try {
      const profile = await getProfile();
      updateProfile(profile);
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  const handleOptionSelect = (index) => {
    if (!showResult) setSelectedOption(index);
  };

  const handleCheck = async () => {
    if (!currentBlock?.question) return;

    const question = currentBlock.question;
    let answer;

    if (question.type === 'mcq') {
      answer = question.options[selectedOption]?.text;
    } else if (question.type === 'fill') {
      answer = userInput.trim();
    } else if (question.type === 'match') {
      answer = matches; // For now, just pass the structure
    }

    try {
      const res = await submitAnswer(question.id, answer);
      setCorrect(res.correct);
      updateProfile({
        xp: res.xp,
        hearts: res.hearts,
        current_streak: res.streak,
      });

      if (!res.correct && res.hearts <= 0) {
        setShowHeartModal(true);
      }
    } catch (err) {
      console.error('Answer submission failed:', err);
      if (err.response?.data?.error === 'Out of hearts') {
        setShowHeartModal(true);
      }
    }

    await refreshProfile();
    setShowResult(true);
  };

  const handleNext = async () => {
    if (isLastBlock) {
      try {
        await markLessonCompleted(lessonId);
        setShowCompletedModal(true);
        await refreshProfile();
        setTimeout(() => {
          setShowCompletedModal(false);
          navigate('/learn', { state: { reload: true } });
        }, 2000);
      } catch (err) {
        console.error("❌ Error marking lesson complete:", err);
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setUserInput('');
    setShowResult(false);
    setCorrect(null);
    setMatches([]);
    setWrongPairs([]);
    setSelectedLeft(null);
  };

  const handleLeftClick = (item) => {
    if (showResult) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item) => {
    if (showResult || !selectedLeft) return;

    setMatches(prev => {
      const filtered = prev.filter(m => m.left !== selectedLeft && m.right !== item);
      return [...filtered, { left: selectedLeft, right: item }];
    });

    setSelectedLeft(null);
  };

  const getPairColor = (left, right) => {
    const index = matches.findIndex(m => m.left === left || m.right === right);
    return pairColors[index % pairColors.length];
  };

  const isIncorrectLeft = (text) => showResult && wrongPairs.some(pair => pair.left === text);
  const isIncorrectRight = (text) => showResult && wrongPairs.some(pair => pair.right === text);

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${((currentIndex + 1) / blocks.length) * 100}%` }} />
      </div>

      <div className={styles.card}>
        <h2>{lesson?.title}</h2>

        {currentBlock?.type === 'text' && (
          <>
            <div className={styles.paragraphBlock}>
              {currentBlock.text.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
            </div>
            <div className={styles.actionRow}>
              <button className={styles.nextBtn} onClick={handleNext}>
                {isLastBlock ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}

        {currentBlock?.type === 'question' && currentBlock.question && (
          <>
            <div className={styles.contextBox}>🧠 {currentBlock.question.text}</div>

            {currentBlock.question.type === 'mcq' && (
              <div className={styles.options}>
                {currentBlock.question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`${styles.optionBtn} ${selectedOption === idx ? styles.selected : ''} ${
                      showResult && selectedOption === idx
                        ? correct ? styles.correct : styles.incorrect
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showResult}
                  >
                    {String.fromCharCode(65 + idx)}. {opt.text}
                  </button>
                ))}
              </div>
            )}

            {currentBlock.question.type === 'fill' && (
              <div className={styles.fillContainer}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={styles.fillInput}
                  placeholder="Type your answer..."
                  disabled={showResult}
                />
              </div>
            )}

            {currentBlock.question.type === 'match' && (
              <div className={styles.matchGrid}>
                <div className={styles.matchColumn}>
                  {currentBlock.question.options.map((opt, idx) => (
                    <button
                      key={idx}
                      className={`${styles.matchBtn} ${selectedLeft === opt.text ? styles.selected : ''} ${styles[getPairColor(opt.text, '')]} ${isIncorrectLeft(opt.text) ? styles.incorrectPair : ''}`}
                      onClick={() => handleLeftClick(opt.text)}
                      disabled={showResult}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                <div className={styles.matchColumn}>
                  {shuffledRightOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      className={`${styles.matchBtn} ${styles[getPairColor('', opt)]} ${isIncorrectRight(opt) ? styles.incorrectPair : ''}`}
                      onClick={() => handleRightClick(opt)}
                      disabled={showResult}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matches.length > 0 && currentBlock.question.type === 'match' && (
              <div className={styles.matchReview}>
                <h4>Your Matches:</h4>
                <ul>
                  {matches.map((m, i) => (
                    <li key={i}>{m.left} ➜ {m.right}</li>
                  ))}
                </ul>
              </div>
            )}

            {showResult && (
              <div className={styles.feedback}>
                {correct ? '✅ Correct!' : '❌ Incorrect'}
              </div>
            )}

            <div className={styles.actionRow}>
              {!showResult ? (
                <>
                  <button className={styles.skipBtn} onClick={handleNext}>Skip</button>
                  <button className={styles.checkBtn} onClick={handleCheck}>Check</button>
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

      {showCompletedModal && (
        <div className={styles.completionOverlay}>
          <div className={styles.completionBox}>
            <h2>🎉 Lesson Completed!</h2>
            <p>You've successfully completed <strong>{lesson.title}</strong>.</p>
            <button className={styles.closeBtn} onClick={() => {
              setShowCompletedModal(false);
              navigate('/learn', { state: { reload: true } });
            }}>
              Got It
            </button>
          </div>
        </div>
      )}

      {showHeartModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Out of Hearts ❤️</h3>
            <p>You’ve used all your hearts for today. Try again after refill!</p>
            <button onClick={() => setShowHeartModal(false)} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonPage;
