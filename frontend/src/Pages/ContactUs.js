import React, { useState } from 'react';
import styles from './ContactUs.module.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = Math.random() > 0.3;
      if (!success) throw new Error();

      setToast({ visible: true, message: 'Message sent successfully!', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setToast({ visible: true, message: 'Failed to send message. Please try again.', type: 'error' });
    }

    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 4000);
  };

  return (
    <div className={styles.wrapper}>
      {toast.visible && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.success : styles.error}`}>
          {toast.message}
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.formSection}>
          <h2>Get in touch</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className={styles.infoSection}>
          <h2>Contact us</h2>
          <ul>
            <li><span className={styles.icon}>📍</span><b> Address:</b> Kathmandu, Nepal</li>
            <li><span className={styles.icon}>📞</span><b> Phone:</b> 01-2503542</li>
            <li><span className={styles.icon}>✉️</span><b> Email:</b> learnIT@gmail.com</li>
            <li><span className={styles.icon}>🌐</span><b> Website:</b> learnIT.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
