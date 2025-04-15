import React, { useEffect, useState } from 'react';
import styles from './ManageLesson.module.css';
import {
  getAllCourses,
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
  fetchQuestionsByLesson,
  addQuestionToLesson,
  updateQuestionById,
  deleteQuestionById
} from '../utils/api';
import AdminSidebar from './AdminSidebar';

function ManageLesson() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openLessonIds, setOpenLessonIds] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [questionHint, setQuestionHint] = useState('');
  const [questionExplanation, setQuestionExplanation] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getAllCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (questionType === 'mcq') {
      setOptions([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ]);
    } else if (questionType === 'fill') {
      setOptions([{ text: '', is_correct: true }]);
    } else if (questionType === 'match') {
      setOptions([{ text: '', match_pair: '' }]);
    }
  }, [questionType]);

  const loadLessons = (courseId) => {
    setSelectedCourseId(courseId);
    setLessons([]);
    setQuestions([]);
    getLessonsByCourse(courseId).then(setLessons);
  };

  const loadQuestions = (lessonId) => {
    fetchQuestionsByLesson(lessonId).then(fetched => {
      setQuestions(prev => {
        const others = prev.filter(q => q.lesson !== lessonId);
        return [...others, ...fetched.map(q => ({ ...q, lesson: lessonId }))];
      });
    });
  };

  const toggleLessonOpen = (lessonId) => {
    if (openLessonIds.includes(lessonId)) {
      setOpenLessonIds(prev => prev.filter(id => id !== lessonId));
    } else {
      setOpenLessonIds(prev => [...prev, lessonId]);
      loadQuestions(lessonId);
    }
  };

  const handleAddOrEditLesson = async () => {
    const payload = { title: lessonTitle, content: lessonContent, course_id: selectedCourseId };
    editingLesson ? await updateLesson(editingLesson.id, payload) : await createLesson(payload);
    setShowLessonModal(false);
    setEditingLesson(null);
    setLessonTitle('');
    setLessonContent('');
    loadLessons(selectedCourseId);
  };

  const handleDeleteLesson = async (id) => {
    await deleteLesson(id);
    setConfirmDelete(null);
    loadLessons(selectedCourseId);
  };

  const handleAddOrEditQuestion = async () => {
    const payload = {
      text: questionText,
      type: questionType,
      hint: questionHint,
      explanation: questionExplanation,
      options,
    };
    editingQuestion
      ? await updateQuestionById(editingQuestion.id, payload)
      : await addQuestionToLesson(selectedLessonId, payload);

    setShowQuestionModal(false);
    setEditingQuestion(null);
    setQuestionText('');
    setQuestionHint('');
    setQuestionExplanation('');
    setQuestionType('mcq');
    loadQuestions(selectedLessonId);
  };

  const handleDeleteQuestion = async (id) => {
    await deleteQuestionById(id);
    setConfirmDelete(null);
    loadQuestions(selectedLessonId);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.sidebar}><AdminSidebar /></div>
      <div className={styles.main}>
        <h1>Manage Lessons & Questions</h1>

        <div className={styles.headerRow}>
          <select value={selectedCourseId} onChange={(e) => loadLessons(e.target.value)} className={styles.select}>
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
          <button className={styles.addButton} onClick={() => setShowLessonModal(true)}>+ Add Lesson</button>
        </div>

        {lessons.map(lesson => {
          const isOpen = openLessonIds.includes(lesson.id);
          return (
            <div key={lesson.id} className={styles.lessonBlock}>
              <div className={styles.lessonHeader}>
                <div className={styles.lessonInfo} onClick={() => toggleLessonOpen(lesson.id)}>
                  <span className={styles.lessonArrow}>{isOpen ? '▼' : '▶'}</span>
                  <div>
                    <div className={styles.cardTitle}>{lesson.title}</div>
                    <div className={styles.cardSub}>{lesson.content}</div>
                  </div>
                </div>

                <div className={styles.lessonButtons}>
                  <button className="edit" onClick={() => {
                    setEditingLesson(lesson);
                    setLessonTitle(lesson.title);
                    setLessonContent(lesson.content);
                    setShowLessonModal(true);
                  }}>Edit</button>
                  <button className="delete" onClick={() => setConfirmDelete({ type: 'lesson', id: lesson.id })}>Delete</button>
                  <button className="addQ" onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setShowQuestionModal(true);
                  }}>+ Question</button>
                </div>
              </div>

              {isOpen && (
                <div className={styles.questionList}>
                  {questions
                    .filter(q => q.lesson === lesson.id)
                    .map(q => (
                      <div key={q.id} className={styles.card}>
                        <div className="w-full">
                          <div className={styles.cardTitle}>{q.text}</div>
                          <div className={styles.cardSub}>Type: {q.type}</div>
                        </div>
                        <div className={styles.actions}>
                          <button className="edit" onClick={() => {
                            setEditingQuestion(q);
                            setQuestionText(q.text);
                            setQuestionType(q.type);
                            setQuestionHint(q.hint);
                            setQuestionExplanation(q.explanation);
                            setOptions(q.options);
                            setShowQuestionModal(true);
                          }}>Edit</button>
                          <button className="delete" onClick={() => setConfirmDelete({ type: 'question', id: q.id })}>Delete</button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Modals */}
        {showLessonModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h3>
              <input value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="Lesson Title" />
              <textarea value={lessonContent} onChange={e => setLessonContent(e.target.value)} placeholder="Lesson Content" />
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowLessonModal(false)}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleAddOrEditLesson}>Save</button>
              </div>
            </div>
          </div>
        )}

        {showQuestionModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>
              <input value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Question Text" />
              <select value={questionType} onChange={e => setQuestionType(e.target.value)}>
                <option value="mcq">Multiple Choice</option>
                <option value="fill">Fill in the Blank</option>
                <option value="match">Matching</option>
              </select>

              {/* MCQ Options */}
              {questionType === 'mcq' && options.map((opt, idx) => (
                <div key={idx} className={styles.mcqOptionRow}>
                  <input
                    type="text"
                    value={opt.text}
                    placeholder={`Option ${idx + 1}`}
                    onChange={(e) =>
                      setOptions(options.map((o, i) => i === idx ? { ...o, text: e.target.value } : o))
                    }
                  />
                  <label>
                    <input
                      type="radio"
                      name="correct"
                      checked={opt.is_correct}
                      onChange={() =>
                        setOptions(options.map((o, i) => ({ ...o, is_correct: i === idx })))
                      }
                    /> Correct
                  </label>
                </div>
              ))}

              {/* Fill in the blank */}
              {questionType === 'fill' && (
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={options[0]?.text || ''}
                  onChange={(e) => setOptions([{ text: e.target.value, is_correct: true }])}
                />
              )}

              {/* Matching */}
              {questionType === 'match' && (
                <>
                  {options.map((opt, idx) => (
                    <div key={idx} className={styles.matchPair}>
                      <input
                        type="text"
                        placeholder={`Q${idx + 1}`}
                        value={opt.text}
                        onChange={(e) =>
                          setOptions(options.map((o, i) => i === idx ? { ...o, text: e.target.value } : o))
                        }
                      />
                      <input
                        type="text"
                        placeholder={`A${idx + 1}`}
                        value={opt.match_pair || ''}
                        onChange={(e) =>
                          setOptions(options.map((o, i) => i === idx ? { ...o, match_pair: e.target.value } : o))
                        }
                      />
                      <button onClick={() => setOptions(options.filter((_, i) => i !== idx))}>✕</button>
                    </div>
                  ))}
                  <button className={styles.addButton} type="button" onClick={() => setOptions([...options, { text: '', match_pair: '' }])}>
                    + Add Pair
                  </button>
                </>
              )}

              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowQuestionModal(false)}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleAddOrEditQuestion}>Save</button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>Are you sure you want to delete this {confirmDelete.type}?</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className={styles.submitBtn} onClick={() =>
                  confirmDelete.type === 'lesson'
                    ? handleDeleteLesson(confirmDelete.id)
                    : handleDeleteQuestion(confirmDelete.id)
                }>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageLesson;
