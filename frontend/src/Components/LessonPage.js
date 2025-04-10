import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`/api/lessons/${lessonId}/`)
      .then((res) => setLesson(res.data))
      .catch((err) => console.error('Failed to load lesson', err));
  }, [lessonId]);

  if (!lesson) return <p>Loading lesson...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>

      {lesson.questions.map((q, idx) => (
        <div key={q.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
          <h4>Q{idx + 1}: {q.text}</h4>

          {q.image && <img src={q.image} alt="question" style={{ maxWidth: '300px' }} />}

          {q.type === 'mcq' && (
            <ul>
              {q.options.map(opt => (
                <li key={opt.id}>
                  <label>
                    <input type="radio" name={`q-${q.id}`} value={opt.text} />
                    {' '}{opt.text}
                  </label>
                </li>
              ))}
            </ul>
          )}

          {q.type === 'fill' && (
            <input type="text" placeholder="Your answer here..." style={{ width: '300px' }} />
          )}

          {q.type === 'image' && (
            <div>
              {q.options.map(opt => (
                <button key={opt.id} style={{ margin: '5px' }}>
                  <img src={opt.text} alt="option" width="100" />
                </button>
              ))}
            </div>
          )}

          {q.type === 'match' && (
            <div>
              {q.options.map((opt, i) => (
                <div key={i}>
                  <strong>{opt.text}</strong> ↔ {opt.match_pair || '________'}
                </div>
              ))}
              <p style={{ fontSize: '12px', color: 'gray' }}>(* Matching is static for now)</p>
            </div>
          )}

          {q.hint && (
            <details>
              <summary style={{ color: 'orange', cursor: 'pointer' }}>💡 Hint</summary>
              <p>{q.hint}</p>
            </details>
          )}

          {q.explanation && (
            <details>
              <summary style={{ color: 'blue', cursor: 'pointer' }}>📖 Explanation</summary>
              <p>{q.explanation}</p>
            </details>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonPage;
