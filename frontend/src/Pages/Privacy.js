import React from 'react';
import styles from './Privacy.module.css';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.link}>Home</Link> / <span>Privacy Policy</span>
      </div>

      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.intro}>
        At LearnIT, we value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and protect your information.
      </p>

      <div className={styles.section}>
        <h2>🔍 Information We Collect</h2>
        <p>
          We collect your name, email address, learning progress, quiz performance, and general usage statistics to improve your experience.
        </p>
      </div>

      <div className={styles.section}>
        <h2>💡 How We Use Your Data</h2>
        <p>
          Your data helps us personalize your learning, track your progress, enhance platform features, and send relevant notifications or updates.
        </p>
      </div>

      <div className={styles.section}>
        <h2>🍪 Cookies & Tracking</h2>
        <p>
          We may use cookies to manage sessions, understand usage patterns, and analyze platform performance through trusted analytics tools.
        </p>
      </div>

      <div className={styles.section}>
        <h2>🤝 Data Sharing</h2>
        <p>
          LearnIT does <strong>not sell your data</strong>. We only share information with trusted third-party services that help operate our platform, such as email services and analytics tools.
        </p>
      </div>

      <div className={styles.section}>
        <h2>🔐 Security</h2>
        <p>
          We implement robust security measures such as password hashing, encrypted storage, and secure login protocols to protect your information.
        </p>
      </div>

      <div className={styles.section}>
        <h2>🧾 Your Rights</h2>
        <p>
          You have the right to request access, correction, or deletion of your data. If you wish to make such a request, contact us using the details below.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
