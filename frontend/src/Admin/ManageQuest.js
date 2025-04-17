import React, { useEffect, useState } from 'react';
import styles from './ManageQuest.module.css';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { getAllQuests, createQuest, deleteQuestById } from '../utils/api';
import AdminSidebar from './AdminSidebar';

Modal.setAppElement('#root'); // For accessibility

const ManageQuest = () => {
  const [quests, setQuests] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    target: '',
    reward_xp: '',
    icon: '',
  });
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const data = await getAllQuests();
      setQuests(data);
    } catch (err) {
      console.error('❌ Failed to load quests:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        target: parseInt(formData.target),
        reward_xp: parseInt(formData.reward_xp),
      };
      await createQuest(payload);
      setFormData({
        title: '',
        type: '',
        target: '',
        reward_xp: '',
        icon: '',
      });
      setMessage('✅ Quest added successfully!');
      fetchQuests();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error adding quest:', err);
      setMessage('❌ Failed to add quest');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quest?')) return;
    try {
      await deleteQuestById(id);
      setMessage('🗑️ Quest deleted');
      fetchQuests();
    } catch (err) {
      console.error('❌ Error deleting quest:', err);
      setMessage('❌ Failed to delete');
    }
  };

  return (
    <div className={styles.grid}>
      <aside className={styles.sidebar}>
        <AdminSidebar />
      </aside>

      <main className={styles.main}>
        <h2>Manage Daily Quests</h2>

        {message && <div className={styles.alert}>{message}</div>}

        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Add Quest
        </button>

        <ul className={styles.questList}>
          {quests.map((q) => (
            <li key={q.id} className={styles.questItem}>
              <span className={styles.questText}>
                {q.icon ? `${q.icon} ` : ''}{q.title} — {q.type} (target: {q.target}, reward: {q.reward_xp} XP)
              </span>
              <button className={styles.deleteBtn} onClick={() => handleDelete(q.id)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h3>Add New Quest</h3>
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <input
              type="text"
              name="title"
              placeholder="Quest Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="xp">Earn XP</option>
              <option value="streak">Streak</option>
              <option value="accuracy">Accuracy</option>
            </select>
            <input
              type="number"
              name="target"
              placeholder="Target Value"
              value={formData.target}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="reward_xp"
              placeholder="XP Reward"
              value={formData.reward_xp}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="icon"
              placeholder="Icon (optional)"
              value={formData.icon}
              onChange={handleChange}
            />

            <div className={styles.modalButtons}>
              <button type="submit" className={styles.submitBtn}>Save</button>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default ManageQuest;
