import { useState } from "react";
import styles from "./MCQ.module.css";

const questions = [
  {
    prompt: "What does 'the flu' mean?",
    options: ["a type of illness", "a type of dessert", "a type of book"],
    correctIndex: 0,
  },
  {
    prompt: "Which animal says 'meow'?",
    options: ["Dog", "Cat", "Cow"],
    correctIndex: 1,
  },
  {
    prompt: "What color is the sky on a clear day?",
    options: ["Blue", "Green", "Pink"],
    correctIndex: 0,
  },
  {
    prompt: "Which season is the coldest?",
    options: ["Winter", "Summer", "Spring"],
    correctIndex: 0,
  },
  {
    prompt: "Which number comes after 5?",
    options: ["4", "6", "7"],
    correctIndex: 1,
  },
  {
    prompt: "What do bees make?",
    options: ["Milk", "Honey", "Water"],
    correctIndex: 1,
  },
  {
    prompt: "What shape has three sides?",
    options: ["Square", "Circle", "Triangle"],
    correctIndex: 2,
  },
  {
    prompt: "What is the opposite of hot?",
    options: ["Cold", "Warm", "Boiling"],
    correctIndex: 0,
  },
  {
    prompt: "Which fruit is red?",
    options: ["Banana", "Apple", "Orange"],
    correctIndex: 1,
  },
];

export default function MCQ() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState("");

  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].correctIndex) {
      setError("");
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        alert("Great job! You've completed the lesson!");
      }
    } else {
      setError("Oops! That's not correct. Try again.");
    }
  };

  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Read and Respond</h2>
        <p className={styles.prompt}>{questions[currentQuestion].prompt}</p>

        <div className={styles.options}>
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={styles.optionButton}
            >
              {option}
            </button>
          ))}
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
