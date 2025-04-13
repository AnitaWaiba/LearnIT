import React, { useEffect, useState } from 'react';
import styles from './ManageLesson.module.css';
import AdminSidebar from './AdminSidebar';
import {
  addQuestionToLesson,
  fetchQuestionsByLesson,
  deleteQuestionById,
  updateQuestionById
} from '../utils/api';

function ManageLesson() {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [questions, setQuestions] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Question form fields
  const [lessonId, setLessonId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [fillAnswer, setFillAnswer] = useState('');
  const [matchPairs, setMatchPairs] = useState([{ left: '', right: '' }]);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch('http://localhost:8000/api/lessons/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setLessons(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to load lessons', err));
  }, []);

  useEffect(() => {
    if (selectedLessonId) {
      fetchQuestionsByLesson(selectedLessonId)
        .then(setQuestions)
        .catch(err => {
          console.error("Failed to fetch questions", err);
          setQuestions([]);
        });
    }
  }, [selectedLessonId]);

  const resetForm = () => {
    setLessonId('');
    setQuestionText('');
    setQuestionType('mcq');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setFillAnswer('');
    setMatchPairs([{ left: '', right: '' }]);
    setHint('');
    setExplanation('');
    setEditingQuestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      text: questionText,
      type: questionType,
      hint,
      explanation,
    };

    if (questionType === 'mcq') {
      payload.options = options.map((opt, idx) => ({
        text: opt,
        is_correct: idx === parseInt(correctAnswer),
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
      if (editingQuestion) {
        await updateQuestionById(editingQuestion.id, payload);
        alert("✅ Question updated");
      } else {
        await addQuestionToLesson(lessonId, payload); // use selected lessonId from form
        alert("✅ Question added");
      }
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      const updated = await fetchQuestionsByLesson(selectedLessonId);
      setQuestions(updated);
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Submission failed");
    }
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setLessonId(question.lesson || selectedLessonId); // Fallback to selected filter lesson
    setQuestionText(question.text);
    setQuestionType(question.type);
    setHint(question.hint || '');
    setExplanation(question.explanation || '');
    if (question.type === 'mcq') {
      setOptions(question.options.map(opt => opt.text));
      const correctIdx = question.options.findIndex(opt => opt.is_correct);
      setCorrectAnswer(String(correctIdx));
    } else if (question.type === 'fill') {
      setFillAnswer(question.options[0]?.text || '');
    } else if (question.type === 'match') {
      setMatchPairs(question.options.map(opt => ({ left: opt.text, right: opt.match_pair })));
    }
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestionById(id);
        setQuestions(questions.filter(q => q.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("❌ Deletion failed");
      }
    }
  };

  return (
    <div className={styles.grid}>
      <div className={styles.sidebar}><AdminSidebar /></div>

      <div className={styles.main}>
        <div className={styles.headerRow}>
          <select
            className={styles.dropdown}
            value={selectedLessonId}
            onChange={(e) => setSelectedLessonId(e.target.value)}
          >
            <option value="">🔻 Select a Course</option>
            {lessons.map(lesson => (
              <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
            ))}
          </select>

          <button
            className={styles.addButton}
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            ➕ Add Question
          </button>
        </div>

        {questions.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Text</th>
                <th>Type</th>
                <th>Hint</th>
                <th>Explanation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id}>
                  <td>{index + 1}</td>
                  <td>{q.text}</td>
                  <td>{q.type}</td>
                  <td>{q.hint || '-'}</td>
                  <td>{q.explanation || '-'}</td>
                  <td className={styles.actions}>
                    <button className={styles.edit} onClick={() => openEditModal(q)}>✏️</button>
                    <button className={styles.delete} onClick={() => handleDelete(q.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noData}>No questions found. Select a lesson or add a question.</p>
        )}
      </div>

      {(showAddModal || showEditModal) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <button className={styles.closeButton} onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }}>×</button>
              <h2>{editingQuestion ? "Edit Question" : "Add Question"}</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label>Select Lesson *</label>
              <select value={lessonId} onChange={e => setLessonId(e.target.value)} required>
                <option value="">-- Select a Lesson --</option>
                {lessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>

              <label>Question Type</label>
              <select value={questionType} onChange={e => setQuestionType(e.target.value)}>
                <option value="mcq">Multiple Choice</option>
                <option value="fill">Fill in the Blank</option>
                <option value="match">Matching</option>
              </select>

              <label>Question Text</label>
              <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} required />

              {questionType === 'mcq' && (
                <>
                  {options.map((opt, idx) => (
                    <input
                      key={idx}
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[idx] = e.target.value;
                        setOptions(copy);
                      }}
                    />
                  ))}
                  <label>Correct Option</label>
                  <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                    <option value="">Select</option>
                    {options.map((_, idx) => (
                      <option key={idx} value={idx}>{String.fromCharCode(65 + idx)}</option>
                    ))}
                  </select>
                </>
              )}

              {questionType === 'fill' && (
                <>
                  <label>Correct Answer</label>
                  <input value={fillAnswer} onChange={e => setFillAnswer(e.target.value)} />
                </>
              )}

              {questionType === 'match' && (
                <>
                  {matchPairs.map((pair, idx) => (
                    <div key={idx} className={styles.matchPair}>
                      <input
                        value={pair.left}
                        onChange={e => {
                          const copy = [...matchPairs];
                          copy[idx].left = e.target.value;
                          setMatchPairs(copy);
                        }}
                        placeholder="Left"
                      />
                      <input
                        value={pair.right}
                        onChange={e => {
                          const copy = [...matchPairs];
                          copy[idx].right = e.target.value;
                          setMatchPairs(copy);
                        }}
                        placeholder="Right"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => setMatchPairs([...matchPairs, { left: '', right: '' }])}>
                    ➕ Add Pair
                  </button>
                </>
              )}

              <label>Hint (optional)</label>
              <textarea value={hint} onChange={e => setHint(e.target.value)} />

              <label>Explanation (optional)</label>
              <textarea value={explanation} onChange={e => setExplanation(e.target.value)} />

              <button type="submit">{editingQuestion ? "Update" : "Submit"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageLesson;
