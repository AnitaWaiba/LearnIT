import React, { useState, useEffect } from 'react';
import styles from './ManageLesson.module.css';
import AdminSidebar from './AdminSidebar';

function ManageLesson() {
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Lesson fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [icon, setIcon] = useState(null);

  // Question fields
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [lessonId, setLessonId] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [fillAnswer, setFillAnswer] = useState('');
  const [matchPairs, setMatchPairs] = useState([{ left: '', right: '' }]);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    // Fetch all lessons for dropdown
    fetch('http://localhost:8000/api/lesson/')
      .then(res => res.json())
      .then(data => setLessons(data.results || []));
  }, []);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    if (icon) formData.append('icon', icon);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/lesson/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        alert('Lesson created');
        setTitle('');
        setDescription('');
        setContent('');
        setIcon(null);
        setShowLessonForm(false);
      }
    } catch {
      alert('Lesson creation failed');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      text: questionText,
      type: questionType,
      lesson: lessonId,
      hint,
      explanation,
      options: [],
    };

    if (questionType === 'mcq') {
      payload.options = options.map((opt, idx) => ({
        text: opt,
        is_correct: idx === parseInt(correctAnswer)
      }));
    } else if (questionType === 'fill') {
      payload.options = [{ text: fillAnswer, is_correct: true }];
    } else if (questionType === 'match') {
      payload.options = matchPairs.map(pair => ({
        text: pair.left,
        match_pair: pair.right
      }));
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/question/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Question created!');
        setShowQuestionForm(false);
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
        setHint('');
        setExplanation('');
        setLessonId('');
        setFillAnswer('');
        setMatchPairs([{ left: '', right: '' }]);
      }
    } catch {
      alert('Failed to add question');
    }
  };

  return (
    <div className={styles.grid}>
      <div className={styles.sidebar}><AdminSidebar /></div>

      <div className={styles.main}>
        <div className={styles.headerButtons}>
          <button onClick={() => setShowLessonForm(true)}>➕ Add Lesson</button>
          <button onClick={() => setShowQuestionForm(true)}>➕ Add Question</button>
        </div>

        <div className={styles.tablePlaceholder}>
          <p>📚 Existing Lessons will appear here</p>
        </div>
      </div>

      {showLessonForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowLessonForm(false)}>×</button>
            <h2 className={styles.modalTitle}>Add New Lesson</h2>
            <form className={styles.form} onSubmit={handleLessonSubmit}>
              <label>Lesson Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />

              <label>Short Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

              <label>Full Content *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

              <label>Upload Icon</label>
              <input type="file" accept="image/*" onChange={(e) => setIcon(e.target.files[0])} />

              <button type="submit">Submit Lesson</button>
            </form>
          </div>
        </div>
      )}

      {showQuestionForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowQuestionForm(false)}>×</button>
            <h2 className={styles.modalTitle}>Add Question</h2>
            <form className={styles.form} onSubmit={handleQuestionSubmit}>
              <label>Select Lesson</label>
              <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} required>
                <option value="">-- Select --</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>

              <label>Question Type</label>
              <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                <option value="mcq">Multiple Choice</option>
                <option value="fill">Fill in the Blank</option>
                <option value="match">Matching</option>
              </select>

              <label>Question Text</label>
              <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />

              {questionType === 'mcq' && (
                <>
                  {options.map((opt, idx) => (
                    <input
                      key={idx}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[idx] = e.target.value;
                        setOptions(newOptions);
                      }}
                    />
                  ))}
                  <label>Correct Option</label>
                  <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                    <option value="">--</option>
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                  </select>
                </>
              )}

              {questionType === 'fill' && (
                <>
                  <label>Correct Answer</label>
                  <input value={fillAnswer} onChange={(e) => setFillAnswer(e.target.value)} />
                </>
              )}

              {questionType === 'match' && (
                <>
                  {matchPairs.map((pair, idx) => (
                    <div key={idx} className={styles.matchPair}>
                      <input placeholder="Left" value={pair.left} onChange={(e) => {
                        const updated = [...matchPairs];
                        updated[idx].left = e.target.value;
                        setMatchPairs(updated);
                      }} />
                      <input placeholder="Right" value={pair.right} onChange={(e) => {
                        const updated = [...matchPairs];
                        updated[idx].right = e.target.value;
                        setMatchPairs(updated);
                      }} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setMatchPairs([...matchPairs, { left: '', right: '' }])}>
                    ➕ Add Pair
                  </button>
                </>
              )}

              <label>Hint (optional)</label>
              <textarea value={hint} onChange={(e) => setHint(e.target.value)} />

              <label>Explanation (optional)</label>
              <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} />

              <button type="submit">Submit Question</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageLesson;
