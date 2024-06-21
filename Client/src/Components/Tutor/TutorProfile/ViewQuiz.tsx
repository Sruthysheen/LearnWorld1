import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchQuizzesByCourseAndTutor } from '../../../Utils/config/axios.GetMethods';
import LoadingSpinner from '../../Common/LoadingSpinner';

export interface Option {
    optionText: string;
    isCorrect: boolean;
  }
  
  export interface QuestionData {
    courseId: string;
    tutorId: string;
    questionText: string;
    options: Option[];
  }

function ViewQuiz() {
    const [quizzes, setQuizzes] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { courseDetails } = useSelector((state: any) => state.course);
  const courseId = courseDetails._id;
  const { tutor } = useSelector((state: any) => state.tutor);
  const tutorId = tutor._id;

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchQuizzesByCourseAndTutor(courseId, tutorId);
        setQuizzes(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [courseId, tutorId]);
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-sky-600">View Quizzes</h2>
      {loading && <LoadingSpinner/>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quizzes.map((quiz, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-semibold text-sky-600">Question {index + 1}: {quiz.questionText}</h3>
          <ul className="list-disc ml-5">
            {quiz.options.map((option, idx) => (
              <li key={idx} className={option.isCorrect ? 'text-lime-500' : 'text-sky-600'}>
                {option.optionText} {option.isCorrect && '(Correct)'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </>
  )
}

export default ViewQuiz