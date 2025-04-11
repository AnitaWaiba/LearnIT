import React, { useState } from 'react';
import styles from './ManageLesson.module.css';

function ManageLesson() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [icon, setIcon] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !content || !icon) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('icon', icon);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/lesson/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Lesson created successfully!');
        setTitle('');
        setDescription('');
        setContent('');
        setIcon(null);
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error.');
    }
  };

  return (
    <div className={styles.manageLesson}>
      <h2>Create a New Lesson</h2>
      <form onSubmit={handleSubmit} className={styles.lessonForm}>
        <label>Lesson Title</label>
        <input
          type="text"
          placeholder="Enter Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Short Description</label>
        <textarea
          placeholder="Small Intro about the Lesson (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Full Content</label>
        <textarea
          placeholder="Lesson Main Content (Theory/Explanation)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label>Upload Lesson Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIcon(e.target.files[0])}
        />

        <button type="submit" className={styles.submitBtn}>
          Add Lesson
        </button>
      </form>
    </div>
  );
}

export default ManageLesson;
