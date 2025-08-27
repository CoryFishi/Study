import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import DeleteQuiz from "../modals/DeleteQuiz";
import { useParams } from "react-router-dom";
type Quiz = {
  _id: string;
  title: string;
  description: string;
  questions: {
    type: Array<{
      _id: string;
      question: string;
      answer: string;
      wrongAnswers: string[];
    }>;
  };
  authorizedUsers: [
    {
      user: string;
      permission: string;
      attempts: {
        score: number;
        correct: number;
        incorrect: number;
        date: Date;
      }[];
    }
  ];
};
const API = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean | null>(false);
  const [questions, setQuestions] = useState<
    Array<{
      _id: string;
      question: string;
      answer: string;
      wrongAnswers: string[];
    }>
  >([]);
  const { user } = useAuth();

  const getQuiz = async () => {
    const response = await fetch(`${API}/app/quizzes/${id}`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);

    setQuiz(data.quiz);
    setQuestions(data.quiz.questions);
  };

  const deleteQuiz = async () => {
    const response = await fetch(`${API}/app/quizzes/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    const data = await response.json();
    console.log("Quiz deleted!");
    return data.quiz._id;
  };
  const archiveQuiz = async (quiz: Quiz) => {
    const response = await fetch(`${API}/app/quizzes/${quiz._id}/archive`, {
      credentials: "include",
      method: "PUT",
    });
    const data = await response.json();
    console.log("Quiz archived!");
    return data.quiz._id;
  };
  const unArchiveQuiz = async (quiz: Quiz) => {
    const response = await fetch(`${API}/app/quizzes/${quiz._id}/unarchive`, {
      credentials: "include",
      method: "PUT",
    });
    const data = await response.json();
    console.log("Quiz unarchived!");
    return data.quiz._id;
  };

  useEffect(() => {
    getQuiz();
  }, []);

  return (
    <div className="min-h-[calc(100vh-theme(space.16))] w-full bg-yellow-50 flex">
      {quiz && (
        <DeleteQuiz
          setIsOpen={setIsDeleteOpen}
          deleteQuiz={deleteQuiz}
          quiz={quiz}
        />
      )}
      <div className="w-5/6 p-5">
        <div className="w-full flex flex-col gap-2">
          {questions.map((question, index) => (
            <div key={question._id} className="p-2 border-b border-zinc-200">
              <h3 className="font-bold">{question.question}</h3>
              <p>{question.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/6 py-5 pr-5 not-lg:w-[200px]">
        <div className="w-full flex flex-col h-full">
          <div className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-5 justify-between select-none">
            <h2>FILTERS & ACTIONS</h2>
          </div>
          <div className="h-full border-x border-b rounded-b border-zinc-200 p-3 gap-2 flex flex-col">
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="font-medium cursor-pointer px-2 py-1 bg-red-200 shadow rounded-lg hover:bg-red-300 hover:scale-105 duration-300"
            >
              Edit Quiz
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="font-medium cursor-pointer px-2 py-1 bg-red-200 shadow rounded-lg hover:bg-red-300 hover:scale-105 duration-300"
            >
              Delete Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
