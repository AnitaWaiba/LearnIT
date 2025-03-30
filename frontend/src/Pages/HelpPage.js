import React, { useState } from 'react';
import styles from './HelpPage.module.css';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: '📘 Account & Profile',
    items: [
      {
        question: 'How do I create a LearnIT account?',
        answer: 'Click the Sign Up button on the homepage and fill in your email, username, and password to get started.',
      },
      {
        question: 'I forgot my password — how do I reset it?',
        answer: 'On the login page, click “Forgot password?” to receive a reset link in your email.',
      },
      {
        question: 'How can I change my username or email address?',
        answer: 'Go to Settings > Profile to update your username or email. Don’t forget to save the changes.',
      },
      {
        question: 'How do I update my profile picture?',
        answer: 'In the profile settings, click the ✎ icon on your avatar to upload a new picture.',
      },
    ],
  },
  {
    category: '🧠 Learning & Practice',
    items: [
      {
        question: 'How does LearnIT personalize my learning?',
        answer: 'LearnIT tracks your progress and adapts lessons to your skill level, focusing on areas that need improvement.',
      },
      {
        question: 'What are daily quests and how do they work?',
        answer: 'Daily quests are mini-challenges that reward you with XP and boost consistency. Complete them every day!',
      },
      {
        question: 'How do I retry a completed lesson?',
        answer: 'You can revisit any lesson you’ve completed from the Learn tab and retake it as many times as you’d like.',
      },
      {
        question: 'What is the Learn section for and how do I use it?',
        answer: 'The Learn section contains all available courses. Tap into any unit to start learning at your own pace.',
      },
      {
        question: 'Can I practice specific topics or repeat difficult questions?',
        answer: 'Yes! Use the Practice tab to focus on weak areas or repeat challenging questions for mastery.',
      },
    ],
  },
  {
    category: '🛡️ Privacy & Security',
    items: [
      {
        question: 'Is my personal data safe on LearnIT?',
        answer: 'Yes, we use industry-standard encryption and do not share your personal data without consent.',
      },
      {
        question: 'How do I report inappropriate behavior or content?',
        answer: 'Use the "Report" button available on content or contact our support team via the Help Center.',
      },
    ],
  },
  {
    category: '💬 Community & Support',
    items: [
      {
        question: 'How do I contact LearnIT support?',
        answer: 'You can reach our team via the Contact Us page or through the Help Center within your dashboard.',
      },
      {
        question: 'Where can I submit feedback or feature suggestions?',
        answer: 'We love hearing from you! Use the feedback form in the Help Center or email us directly.',
      },
    ],
  },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs}>
        <Link to="/settings" className={styles.crumb}>🏠 Home</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>Help Center</span>
      </nav>

      <h1 className={styles.header}>Frequently Asked Questions</h1>

      {faqData.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          <h2 className={styles.category}>{section.category}</h2>
          {section.items.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.question} onClick={() => toggle(`${sectionIndex}-${i}`)}>
                {item.question}
                <span>{openIndex === `${sectionIndex}-${i}` ? '▲' : '▼'}</span>
              </div>
              {openIndex === `${sectionIndex}-${i}` && (
                <div className={styles.answer}>{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HelpPage;
