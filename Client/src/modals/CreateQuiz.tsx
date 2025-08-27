import { MdCreate } from "react-icons/md";
import { useState } from "react";

function CreateQuiz({
  setIsOpen,
  createQuiz,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createQuiz: (title: string, description: string) => Promise<number>;
}) {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setIsLoading(true);
    await createQuiz(quizTitle, quizDescription);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="flex items-center justify-center h-full">
        <div className="bg-yellow-50 p-5 rounded-xl shadow-lg w-11/12 max-w-lg">
          <div className="flex w-full justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MdCreate />
              <h2 className="text-xl font-bold">Create New Quiz</h2>
            </div>
            {isLoading && (
              <h2 className="text-lg w-7 h-7 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></h2>
            )}
          </div>
          <form
            className="flex flex-col gap-1"
            onSubmit={async (e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="flex flex-col">
              <label className="mb-1 font-medium" htmlFor="quizTitle">
                Quiz Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="quizTitle"
                className="border bg-white border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Enter quiz title"
                maxLength={32}
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 text-right">
                {quizTitle.length}/32
              </p>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium" htmlFor="quizDescription">
                Description <span className="text-zinc-400">(optional)</span>
              </label>
              <textarea
                id="quizDescription"
                className="border bg-white border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Enter quiz description"
                rows={4}
                maxLength={256}
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              ></textarea>
              <p className="text-sm text-gray-500 text-right">
                {quizDescription.length}/256
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="font-medium cursor-pointer px-2 py-1 bg-zinc-200 shadow rounded-lg hover:bg-zinc-300 hover:scale-105 duration-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-medium cursor-pointer px-2 py-1 bg-amber-200 shadow rounded-lg hover:bg-amber-300 hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  quizTitle.trim() ? "Create Quiz" : "Please enter a quiz title"
                }
                disabled={!quizTitle.trim()}
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;
