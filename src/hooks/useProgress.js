import { useState, useEffect } from 'react';

export const useProgress = () => {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('tripos_completed');
    return saved ? JSON.parse(saved) : {};
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('tripos_scores');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('tripos_completed', JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem('tripos_scores', JSON.stringify(scores));
  }, [scores]);

  const toggleComplete = (topicId, year, paper, question) => {
    const id = `${topicId}-${year}-p${paper}-q${question}`;
    setCompleted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const setScore = (topicId, year, paper, question, score) => {
    const id = `${topicId}-${year}-p${paper}-q${question}`;
    setScores(prev => ({
      ...prev,
      [id]: score
    }));
  };

  return { completed, scores, toggleComplete, setScore };
};
