// src/hooks/useProblemData.js
import { useState, useEffect } from 'react';

const useProblemData = () => {
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [notes, setNotes] = useState({});
  const [reviewDates, setReviewDates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, solutionsRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}problems.json`),
          fetch(`${import.meta.env.BASE_URL}solutions.json`)
        ]);

        if (!problemsRes.ok || !solutionsRes.ok) throw new Error("Failed to load data");

        const [problemsData, solutionsData] = await Promise.all([
          problemsRes.json(),
          solutionsRes.json()
        ]);

        const savedData = {
          progress: JSON.parse(localStorage.getItem('userProgress')) || {},
          notes: JSON.parse(localStorage.getItem('userNotes')) || {},
          reviewDates: JSON.parse(localStorage.getItem('reviewDates')) || {}
        };

        setProblems(problemsData.map(p => ({
          ...p,
          completed: savedData.progress[p.id]?.completed || false,
          starred: savedData.progress[p.id]?.starred || false,
        })));
        setSolutions(solutionsData);
        setNotes(savedData.notes);
        setReviewDates(savedData.reviewDates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return { problems, setProblems, solutions, notes, setNotes, reviewDates, setReviewDates };
};

export default useProblemData;