import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { postQuiz } from '../../../Utils/config/axios.PostMethods';
import { toast } from "sonner";

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

const AddQuiz = () => {
  const [questions, setQuestions] = useState<{ questionText: string; options: Option[] }[]>([
    { questionText: '', options: [{ optionText: '', isCorrect: false }] },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { courseDetails } = useSelector((state:any) => state.course);
  const courseId = courseDetails._id;
  const {tutor} = useSelector((state:any)=>state.tutor)
  const tutorId = tutor._id;

  const handleQuestionTextChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: keyof Option, value: string | boolean) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][field] = value as never;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [{ optionText: '', isCorrect: false }] }]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
    
      const formattedQuestions = questions.map(({ questionText, options }) => ({
        courseId: courseId,
        tutorId: tutorId,
        questionText,
        options: options.map(({ optionText, isCorrect }) => ({ optionText, isCorrect })),
      }));
  
      
      const response = await postQuiz(formattedQuestions);
  
      if (!response) {
        toast.error('Failed to save the questions');
      }
  
     
      setQuestions([{ questionText: '', options: [{ optionText: '', isCorrect: false }] }]);
      toast.success('Questions saved successfully!');
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
    <h2 className="text-2xl font-semibold mb-4">Add Quiz</h2>
    <form onSubmit={handleSubmit}>
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-6">
          <label className="block mb-2 font-semibold">Question {questionIndex + 1}</label>
          <input
            type="text"
            value={question.questionText}
            onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-sky-500"
            required
          />
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center mt-2">
              <input
                type="text"
                value={option.optionText}
                onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'optionText', e.target.value)}
                className="mr-2 px-3 py-2 border rounded-md focus:outline-none focus:border-sky-500"
                required
              />
              <input
                type="checkbox"
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                className="mr-2"
              />
              <label>Correct</label>
              {question.options.length > 1 && (
                <button type="button" onClick={() => handleRemoveOption(questionIndex, optionIndex)} className="ml-2 text-red-600">
                  Remove Option
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => handleAddOption(questionIndex)} className="mt-2 bg-sky-500 text-white py-2 px-4 rounded-md">
            Add Option
          </button>
          {questions.length > 1 && (
            <button type="button" onClick={() => handleRemoveQuestion(questionIndex)} className="ml-4 text-red-600">
              Remove Question
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddQuestion} className="mb-4 bg-sky-500 text-white py-2 px-4 rounded-md">
        Add Question
      </button>
      <div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-6 rounded-md">
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </form>
  </div>
  );
};

export default AddQuiz;
