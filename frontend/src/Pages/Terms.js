import React from 'react';
import styles from './Terms.module.css';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.link}>Home</Link> / <span>Terms of Use</span>
      </div>

      <h1 className={styles.heading}>Terms of Use</h1>
      <p className={styles.intro}>
        These Terms of Use outline the rules and responsibilities that govern your use of the LearnIT platform. By continuing to use this platform, you agree to these terms and conditions.
      </p>

      <div className={styles.section}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using LearnIT, users automatically agree to comply with these terms. These terms form a binding agreement between the user and the LearnIT platform and must be followed at all times when using the service.
        </p>
      </div>

      <div className={styles.section}>
        <h2>2. Account Responsibility</h2>
        <p>
          Each user is responsible for maintaining the confidentiality of their login credentials, including email and password. Any activity carried out from their account is their responsibility. Sharing login details or unauthorized access to another user’s account is strictly prohibited.
        </p>
      </div>

      <div className={styles.section}>
        <h2>3. User Conduct</h2>
        <p>
          All users are expected to behave ethically and respectfully. Cheating in quizzes or lessons, exploiting bugs, spamming, or uploading offensive or abusive content is not allowed. Any misuse of the platform will result in warnings or permanent suspension.
        </p>
      </div>

      <div className={styles.section}>
        <h2>4. Content Ownership</h2>
        <p>
          Users retain ownership of the personal data and progress they provide. However, all educational materials, design elements, source code, and gamification systems provided by LearnIT are the intellectual property of the platform unless stated otherwise.
        </p>
      </div>

      <div className={styles.section}>
        <h2>5. Termination Clause</h2>
        <p>
          LearnIT reserves the full right to suspend, limit, or terminate user accounts without prior notice if any user violates the terms or harms the platform’s integrity. This ensures a safe and focused learning environment for all.
        </p>
      </div>

      <div className={styles.section}>
        <h2>6. Limitation of Liability</h2>
        <p>
          While LearnIT aims to provide a seamless learning experience, it does not guarantee that the platform will be free of errors or interruptions. We are not liable for any losses, damages, or disruptions resulting from technical issues, data breaches, or user error.
        </p>
      </div>

      <div className={styles.section}>
        <h2>7. Updates to Terms</h2>
        <p>
          These terms may be updated periodically based on system improvements, new features, or legal regulations. Once posted, the updated terms become immediately effective. Continued use of LearnIT after changes indicates your acceptance of the new terms.
        </p>
      </div>
    </div>
  );
};

export default Terms;
