import { useState } from "react";
import Quiz from "../pages/QuizesPage";
import { CgTrash } from "react-icons/cg";

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

function DeleteQuiz({
  setIsOpen,
  deleteQuiz,
  quiz,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
  deleteQuiz: (id: string) => Promise<void>;
  quiz: Quiz | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const submit = async () => {
    if (!quiz || !quiz._id) return;
    setIsLoading(true);
    await deleteQuiz(quiz._id);
    setIsOpen(null);
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="flex items-center justify-center h-full">
        <div className="bg-yellow-50 p-5 rounded-xl shadow-lg w-11/12 max-w-lg">
          <div className="flex w-full justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CgTrash />
              <h2 className="text-xl font-bold">
                Delete Quiz {quiz?.title ?? ""}
              </h2>
            </div>
            {isLoading && (
              <h2 className="text-lg w-7 h-7 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></h2>
            )}
          </div>
          <p>Are you sure you want to delete this quiz?</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="font-medium cursor-pointer px-2 py-1 bg-zinc-200 shadow rounded-lg hover:bg-zinc-300 hover:scale-105 duration-300"
              onClick={() => setIsOpen(null)}
            >
              Cancel
            </button>
            <button
              onClick={() => submit()}
              className="font-medium cursor-pointer px-2 py-1 bg-amber-200 shadow rounded-lg hover:bg-amber-300 hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteQuiz;
