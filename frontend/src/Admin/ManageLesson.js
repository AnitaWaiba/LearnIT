import React, { useEffect, useState } from 'react';
import styles from './ManageLesson.module.css';
import {
  getAllCourses,
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonBlocks,
  addParagraphBlock,
  updateParagraphBlock,
  deleteParagraphBlock,
  addQuestionToLesson,
  updateQuestionById,
  deleteQuestionById,
} from '../utils/api';
import AdminSidebar from './AdminSidebar';

function ManageLesson() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonBlocks, setLessonBlocks] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');

  const [openLessonIds, setOpenLessonIds] = useState([]);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showParagraphModal, setShowParagraphModal] = useState(false);

  const [editingLesson, setEditingLesson] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingParagraph, setEditingParagraph] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [questionHint, setQuestionHint] = useState('');
  const [questionExplanation, setQuestionExplanation] = useState('');
  const [options, setOptions] = useState([]);
  const [fillAnswers, setFillAnswers] = useState({});

  const [paragraphText, setParagraphText] = useState('');

  useEffect(() => {
    getAllCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (questionType === 'mcq') {
      setOptions([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
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
    setLessonBlocks([]);
    getLessonsByCourse(courseId).then(setLessons);
  };

  const loadBlocks = (lessonId) => {
    getLessonBlocks(lessonId).then((data) => {
      setLessonBlocks((prev) => {
        const withoutCurrent = prev.filter(b => b.lesson !== lessonId);
        // Add freshly loaded blocks
        const withNew = data.blocks.map((b) => ({ ...b, lesson: lessonId }));
        return [...withoutCurrent, ...withNew];
      });
    });
  };

  const toggleLessonOpen = (lessonId) => {
    if (openLessonIds.includes(lessonId)) {
      setOpenLessonIds((prev) => prev.filter((id) => id !== lessonId));
    } else {
      setOpenLessonIds((prev) => [...prev, lessonId]);
      loadBlocks(lessonId);
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

    if (editingQuestion) {
      await updateQuestionById(editingQuestion.id, payload);
    } else {
      await addQuestionToLesson(selectedLessonId, payload);
    }

    // ✅ Close modal and clear state
    setShowQuestionModal(false);
    setEditingQuestion(null);
    setQuestionText('');
    setQuestionHint('');
    setQuestionExplanation('');
    setQuestionType('mcq');

    // ✅ Force reload
    loadBlocks(selectedLessonId);
  };


  const handleDeleteQuestion = async (id) => {
    await deleteQuestionById(id);
    setConfirmDelete(null);
    loadBlocks(selectedLessonId);
  };

  const handleAddOrEditParagraph = async () => {
    if (editingParagraph) {
      await updateParagraphBlock(editingParagraph.id, { text: paragraphText, type: 'text' });
    } else {
      await addParagraphBlock(selectedLessonId, {
        type: 'text',
        order: lessonBlocks.filter((b) => b.lesson === selectedLessonId).length + 1,
        text: paragraphText,
      });
    }
    setShowParagraphModal(false);
    setParagraphText('');
    setEditingParagraph(null);
    loadBlocks(selectedLessonId);
  };

  const handleDeleteParagraph = async (id) => {
    await deleteParagraphBlock(id);
    setConfirmDelete(null);
    loadBlocks(selectedLessonId);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.sidebar}><AdminSidebar /></div>
      <div className={styles.main}>
        <h1>Manage Lessons</h1>
        <div className={styles.headerRow}>
          <select value={selectedCourseId} onChange={(e) => loadLessons(e.target.value)} className={styles.select}>
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
          <button
            className={styles.iconButton}
            onClick={() => {
              setShowLessonModal(true);
              setEditingLesson(null);
              setLessonTitle('');
              setLessonContent('');
            }}
          >
            ➕
          </button>
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
                <div className={styles.lessonActionRight}>
                  <button 
                  className={styles.iconButton}
                  onClick={() => {
                    setEditingLesson(lesson);
                    setLessonTitle(lesson.title);
                    setLessonContent(lesson.content);
                    setShowLessonModal(true);
                  }}>📝</button>
                  <button className={styles.iconButton} onClick={() => setConfirmDelete({ type: 'lesson', id: lesson.id })}>🗑️</button>
                  <button 
                  className={styles.iconButton}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setShowQuestionModal(true);
                  }}>❓</button>
                  <button 
                  className={styles.iconButton}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setShowParagraphModal(true);
                  }}>➕</button>
                </div>
              </div>

              {isOpen && (
                <div className={styles.questionList}>
                  {lessonBlocks
                    .filter(b => b.lesson === lesson.id)
                    .sort((a, b) => a.order - b.order)
                    .map(block => (
                      <div key={block.id} className={styles.card}>
                        {block.type === 'text' ? (
                            <div className={styles.paragraphContainer}>
                              <div className={styles.paragraphContent}>
                                <div className={styles.cardTitle}>📄 Paragraph</div>
                                <div className={styles.cardSub}>{block.text}</div>
                              </div>
                              <div className={styles.actions}>
                                <button className={styles.iconButton} onClick={() => {
                                  setParagraphText(block.text);
                                  setEditingParagraph(block);
                                  setShowParagraphModal(true);
                                  setSelectedLessonId(lesson.id);
                                }}>📝</button>
                                <button className={styles.iconButton} onClick={() =>
                                  setConfirmDelete({ type: 'paragraph', id: block.id })
                                }>🗑️</button>
                              </div>
                            </div>
                          ) : (

                          <>
                            <div className={styles.cardTitle}>🧠 {block.question?.text}</div>
                            <div className={styles.cardSub}>Type: {block.question?.type}</div>
                            <div className={styles.actions}>
                              <button
                                className={styles.iconButton}
                                onClick={() => {
                                  setEditingQuestion(block.question);
                                  setQuestionText(block.question.text);
                                  setQuestionType(block.question.type);
                                  setQuestionHint(block.question.hint);
                                  setQuestionExplanation(block.question.explanation);
                                  setOptions(block.question.options || []);
                                  setSelectedLessonId(lesson.id);
                                  setShowQuestionModal(true);
                                }}
                              >
                                📝
                              </button>
                              <button
                                className={styles.iconButton}
                                onClick={() =>
                                  setConfirmDelete({ type: 'question', id: block.question.id })
                                }
                              >
                                🗑️
                              </button>
                            </div>
                          </>


                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Lesson Modal */}
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

        {/* Question Modal */}
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

        {/* Paragraph Modal */}
        {showParagraphModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>{editingParagraph ? 'Edit Paragraph' : 'Add Paragraph'}</h3>
              <textarea
                className={styles.paragraphTextarea}
                placeholder="Paragraph content..."
                value={paragraphText}
                onChange={(e) => setParagraphText(e.target.value)}
              />
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => {
                  setShowParagraphModal(false);
                  setEditingParagraph(null);
                  setParagraphText('');
                }}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleAddOrEditParagraph}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>Are you sure you want to delete this {confirmDelete.type}?</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className={styles.submitBtn} onClick={() =>
                  confirmDelete.type === 'lesson'
                    ? handleDeleteLesson(confirmDelete.id)
                    : confirmDelete.type === 'question'
                    ? handleDeleteQuestion(confirmDelete.id)
                    : handleDeleteParagraph(confirmDelete.id)
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