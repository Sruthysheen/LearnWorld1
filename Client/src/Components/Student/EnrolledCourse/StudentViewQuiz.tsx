import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchQuizzesByCourse } from '../../../Utils/config/axios.GetMethods';
import LoadingSpinner from '../../Common/LoadingSpinner';

export interface Option {
  _id: string; // Change the type to string
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionData {
  courseId: string;
  tutorId: string;
  questionText: string;
  options: Option[];
  selectedOption?: string; // Change the type to string
}

function StudentViewQuiz() {
  const [quizzes, setQuizzes] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { courseDetails } = useSelector((state: any) => state.course);
  const courseId = courseDetails._id;

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseId = courseDetails.courseId._id;
        const response = await fetchQuizzesByCourse(courseId);
        const dataWithSelection = response.data.map((quiz: QuestionData) => ({
          ...quiz,
          selectedOption: undefined,
        }));
        setQuizzes(dataWithSelection);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [courseDetails]);

  const handleOptionChange = (questionIndex: number, optionId: string) => {
    const updatedQuizzes = quizzes.map((quiz, index) => {
      if (index === questionIndex) {
        return { ...quiz, selectedOption: optionId };
      }
      return quiz;
    });
    setQuizzes(updatedQuizzes);
    setSubmissionError(null); 
  };

  const handleSubmit = () => {
    const isAllSelected = quizzes.every((quiz) => quiz.selectedOption !== undefined);

    if (!isAllSelected) {
      setSubmissionError("Please select an option for all questions.");
      return;
    }
    let score = 0;
    quizzes.forEach((quiz) => {
      const correctOptionId = quiz.options.find((option) => option.isCorrect)?._id;
      if (quiz.selectedOption === correctOptionId) {
        score++;
      }
    });
    console.log('Score:', score);
    setScore(score);
    if (score === 0) {
      setSubmissionError("Your score is zero. You need improvement.");
    } else {
      setSubmissionError(null); 
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Take Quiz</h2>
      {loading && <LoadingSpinner/>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quizzes.map((quiz, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-semibold text-sky-700">Question {index + 1}: {quiz.questionText}</h3>
          <div>
            {quiz.options.map((option, idx) => (
              <label key={idx} className="block text-sky-600 font-medium mt-2">
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={quiz.selectedOption === option._id}
                  onChange={() => handleOptionChange(index, option._id)}
                />
                {option.optionText}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-sky-500 text-white font-bold rounded hover:bg-blue-700">
        Submit Quiz
      </button>
      {submissionError && (
        <div className="mt-4">
          <p className="text-red-700 text-xl">{submissionError}</p>
        </div>
      )}
      {score !== null && score > 0 && (
  <div className="mt-4">
    <p className="font-semibold text-4xl text-pink-500">Your score is {score}/{quizzes.length}.</p>
  </div>
)}
    </div>
  );
}

export default StudentViewQuiz;
