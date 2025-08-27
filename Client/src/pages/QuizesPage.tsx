import { RiMenuFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { BiEdit, BiLink } from "react-icons/bi";
import { CgTrash } from "react-icons/cg";
import CreateQuiz from "../modals/CreateQuiz";
import { useAuth } from "../auth/AuthContext";
import DeleteQuiz from "../modals/DeleteQuiz";
import { FaArchive } from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

function QuizesPage() {
  const [isYourQuizzesCollapsed, setIsYourQuizzesCollapsed] = useState(false);
  const [isArchivedQuizzesCollapsed, setIsArchivedQuizzesCollapsed] =
    useState(false);
  const [isSharedQuizzesCollapsed, setIsSharedQuizzesCollapsed] =
    useState(false);
  const [isYourQuizzesHidden, setIsYourQuizzesHidden] = useState(false);
  const [isArchivedQuizzesHidden, setIsArchivedQuizzesHidden] = useState(true);
  const [isSharedQuizzesHidden, setIsSharedQuizzesHidden] = useState(false);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
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
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([]);
  const [archivedQuizzes, setArchivedQuizzes] = useState<Quiz[]>([]);
  const [sharedQuizzes, setSharedQuizzes] = useState<Quiz[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean | null>(false);
  const { user } = useAuth();

  const getQuizzes = async () => {
    const response = await fetch(`${API}/app/quizzes`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);

    setUserQuizzes(data.userQuizzes);
    setArchivedQuizzes(data.archivedQuizzes);
    setSharedQuizzes(data.sharedQuizzes);
  };

  const createQuiz = async (title: string, description: string) => {
    console.log("Creating quiz:", { title, description });
    const response = await fetch(`${API}/app/quizzes`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        authorId: user?.id ?? null,
      }),
    });
    const data = await response.json();
    setUserQuizzes((prev) => [...prev, data.quiz]);
    console.log(response);
    console.log("Quiz created!");
    return data.quiz._id;
  };

  const deleteQuiz = async (id: string) => {
    const response = await fetch(`${API}/app/quizzes/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    const data = await response.json();
    setUserQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
    setArchivedQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
    setSharedQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
    console.log("Quiz deleted!");
    return data.quiz._id;
  };

  const archiveQuiz = async (quiz: Quiz) => {
    const response = await fetch(`${API}/app/quizzes/${quiz._id}/archive`, {
      credentials: "include",
      method: "PUT",
    });
    const data = await response.json();
    setUserQuizzes((prev) => prev.filter((q) => q._id !== quiz._id));
    setArchivedQuizzes((prev) => [...prev, data.quiz]);
    console.log("Quiz archived!");
    return data.quiz._id;
  };

  const unArchiveQuiz = async (quiz: Quiz) => {
    const response = await fetch(`${API}/app/quizzes/${quiz._id}/unarchive`, {
      credentials: "include",
      method: "PUT",
    });
    const data = await response.json();
    setUserQuizzes((prev) => [...prev, data.quiz]);
    setArchivedQuizzes((prev) => prev.filter((q) => q._id !== quiz._id));
    console.log("Quiz unarchived!");
    return data.quiz._id;
  };

  useEffect(() => {
    getQuizzes();
  }, []);

  return (
    <div className="min-h-[calc(100vh-theme(space.16))] w-full bg-yellow-50 flex">
      {isCreateQuizModalOpen && (
        <CreateQuiz
          setIsOpen={setIsCreateQuizModalOpen}
          createQuiz={createQuiz}
        />
      )}
      {isDeleteOpen && (
        <DeleteQuiz
          setIsOpen={setIsDeleteOpen}
          deleteQuiz={deleteQuiz}
          quiz={selectedQuiz}
        />
      )}
      <div className="w-5/6 p-5">
        <div className="w-full flex flex-col gap-2">
          {!isYourQuizzesHidden && (
            <div>
              <div
                className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-10 justify-between cursor-pointer"
                onClick={() =>
                  setIsYourQuizzesCollapsed(!isYourQuizzesCollapsed)
                }
              >
                <h2 className="select-none">YOUR QUIZES</h2>
                <RiMenuFill className="text-black select-none" />
              </div>
              {!isYourQuizzesCollapsed && (
                <div className="h-full border-x border-b rounded-b border-zinc-200 min-h-12 p-3 max-h-screen">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-zinc-200 border-b">
                        <th className="px-2 py-1 font-medium">Quiz</th>
                        <th className="px-2 py-1 font-medium">Description</th>
                        <th className="px-2 py-1 font-medium">Last Score</th>
                        <th className="px-2 py-1 font-medium">
                          Last 5 Average
                        </th>
                        <th className="px-2 py-1 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userQuizzes.length !== 0 &&
                        userQuizzes.map((quiz) => (
                          <tr
                            key={quiz._id}
                            className="border-b border-b-zinc-200 text-center"
                          >
                            <td className="px-2 py-1 hover:text-blue-500 cursor-pointer">
                              <a
                                href={`/quizzes/${quiz._id}`}
                                className="flex gap-2 justify-center items-center h-full w-full truncate"
                              >
                                {quiz.title} <BiLink />
                              </a>
                            </td>
                            <td className="px-2 py-1 truncate">
                              {quiz.description}
                            </td>
                            <td className="px-2 py-1">
                              {(() => {
                                const authorizedUser =
                                  quiz.authorizedUsers.find(
                                    (au) => au.user === user?.id
                                  );
                                if (
                                  authorizedUser &&
                                  authorizedUser.attempts &&
                                  authorizedUser.attempts.length > 0
                                ) {
                                  const lastAttempt =
                                    authorizedUser.attempts[
                                      authorizedUser.attempts.length - 1
                                    ];
                                  return `${lastAttempt.score}%`;
                                }
                                return "No Attempts";
                              })()}
                            </td>
                            <td className="px-2 py-1">
                              {(() => {
                                const authorizedUser =
                                  quiz.authorizedUsers.find(
                                    (au) => au.user === user?.id
                                  );
                                if (
                                  authorizedUser &&
                                  authorizedUser.attempts &&
                                  authorizedUser.attempts.length > 0
                                ) {
                                  const last5Scores = authorizedUser.attempts
                                    .slice(-5)
                                    .map((attempt) => attempt.score ?? 0);
                                  const avg =
                                    last5Scores.reduce(
                                      (sum, score) => sum + score,
                                      0
                                    ) / last5Scores.length;
                                  return `${Math.round(avg)}%`;
                                }
                                return "No Attempts";
                              })()}
                            </td>
                            <td className="px-2 py-1 flex gap-2 justify-center text-lg text-zinc-600">
                              {quiz.authorizedUsers.some(
                                (au) =>
                                  au.user === user?.id &&
                                  au.permission === "write"
                              ) && (
                                <>
                                  <a
                                    href={`/quizzes/${quiz._id}/edit`}
                                    title="Edit Quiz"
                                  >
                                    <BiEdit className="cursor-pointer hover:text-blue-500 w-8 h-8 hover:scale-105 duration-300" />
                                  </a>
                                  <CgTrash
                                    className="cursor-pointer hover:text-red-500 w-8 h-8 hover:scale-105 duration-300"
                                    title="Delete Quiz"
                                    onClick={() => setSelectedQuiz(quiz)}
                                  />
                                  <FaArchive
                                    title="Archive Quiz"
                                    className="cursor-pointer hover:text-yellow-500 w-7 h-7 hover:scale-105 duration-300"
                                    onClick={() => archiveQuiz(quiz)}
                                  />
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      {userQuizzes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-2">
                            No quizzes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {!isArchivedQuizzesHidden && (
            <div>
              <div
                className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-10 justify-between cursor-pointer"
                onClick={() =>
                  setIsArchivedQuizzesCollapsed(!isArchivedQuizzesCollapsed)
                }
              >
                <h2 className="select-none">ARCHIVED QUIZES</h2>
                <RiMenuFill className="text-black select-none" />
              </div>
              {!isArchivedQuizzesCollapsed && (
                <div className="h-full border-x border-b rounded-b border-zinc-200 min-h-12 p-3 max-h-screen">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-zinc-200 border-b">
                        <th className="px-2 py-1 font-medium">Quiz</th>
                        <th className="px-2 py-1 font-medium">Description</th>
                        <th className="px-2 py-1 font-medium">Last Score</th>
                        <th className="px-2 py-1 font-medium">
                          Last 5 Average
                        </th>
                        <th className="px-2 py-1 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archivedQuizzes.length !== 0 &&
                        archivedQuizzes.map((quiz) => (
                          <tr
                            key={quiz._id}
                            className="border-b border-b-zinc-200 text-center"
                          >
                            <td className="px-2 py-1 hover:text-blue-500 cursor-pointer">
                              <a
                                href={`/quizzes/${quiz._id}`}
                                className="flex gap-2 justify-center items-center h-full w-full truncate"
                              >
                                {quiz.title} <BiLink />
                              </a>
                            </td>
                            <td className="px-2 py-1 truncate">
                              {quiz.description}
                            </td>
                            <td className="px-2 py-1">
                              {(() => {
                                const authorizedUser =
                                  quiz.authorizedUsers.find(
                                    (au) => au.user === user?.id
                                  );
                                if (
                                  authorizedUser &&
                                  authorizedUser.attempts &&
                                  authorizedUser.attempts.length > 0
                                ) {
                                  const lastAttempt =
                                    authorizedUser.attempts[
                                      authorizedUser.attempts.length - 1
                                    ];
                                  return `${lastAttempt.score}%`;
                                }
                                return "No Attempts";
                              })()}
                            </td>
                            <td className="px-2 py-1">
                              {(() => {
                                const authorizedUser =
                                  quiz.authorizedUsers.find(
                                    (au) => au.user === user?.id
                                  );
                                if (
                                  authorizedUser &&
                                  authorizedUser.attempts &&
                                  authorizedUser.attempts.length > 0
                                ) {
                                  const last5Scores = authorizedUser.attempts
                                    .slice(-5)
                                    .map((attempt) => attempt.score ?? 0);
                                  const avg =
                                    last5Scores.reduce(
                                      (sum, score) => sum + score,
                                      0
                                    ) / last5Scores.length;
                                  return `${Math.round(avg)}%`;
                                }
                                return "No Attempts";
                              })()}
                            </td>
                            <td className="px-2 py-1 flex gap-2 justify-center text-lg text-zinc-600">
                              {quiz.authorizedUsers.some(
                                (au) =>
                                  au.user === user?.id &&
                                  au.permission === "write"
                              ) && (
                                <>
                                  <a href={`/quizzes/${quiz._id}/edit`}>
                                    <BiEdit className="cursor-pointer hover:text-blue-500 w-8 h-8 hover:scale-105 duration-300" />
                                  </a>
                                  <CgTrash
                                    className="cursor-pointer hover:text-red-500 w-8 h-8 hover:scale-105 duration-300"
                                    onClick={() => setSelectedQuiz(quiz)}
                                  />
                                  <FaArchive
                                    className="cursor-pointer hover:text-yellow-500 w-7 h-7 hover:scale-105 duration-300"
                                    onClick={() => unArchiveQuiz(quiz)}
                                  />
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      {archivedQuizzes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-2">
                            No quizzes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {!isSharedQuizzesHidden && (
            <div>
              <div
                className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-10 justify-between cursor-pointer"
                onClick={() =>
                  setIsSharedQuizzesCollapsed(!isSharedQuizzesCollapsed)
                }
              >
                <h2 className="select-none">YOUR QUIZES</h2>
                <RiMenuFill className="text-black select-none" />
              </div>
              {!isSharedQuizzesCollapsed && (
                <div className="h-full border-x border-b rounded-b border-zinc-200 min-h-12 p-3 max-h-screen">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-zinc-200 border-b">
                        <th className="px-2 py-1 font-medium">Quiz</th>
                        <th className="px-2 py-1 font-medium">Description</th>
                        <th className="px-2 py-1 font-medium">Last Score</th>
                        <th className="px-2 py-1 font-medium">
                          Last 5 Average
                        </th>
                        <th className="px-2 py-1 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedQuizzes.length !== 0 &&
                        sharedQuizzes.map((quiz) => (
                          <tr
                            key={quiz._id}
                            className="border-b border-b-zinc-200 text-center"
                          >
                            <td className="px-2 py-1 hover:text-blue-500 cursor-pointer">
                              <a
                                href={`/quizzes/${quiz._id}`}
                                className="flex gap-2 justify-center items-center h-full w-full truncate"
                              >
                                {quiz.title} <BiLink />
                              </a>
                            </td>
                            <td className="px-2 py-1 truncate">
                              {quiz.description}
                            </td>
                            <td className="px-2 py-1">
                              {(() => {
                                const authorizedUser =
                                  quiz.authorizedUsers.find(
                                    (au) => au.user === user?.id
                                  );
                                if (
                                  authorizedUser &&
                                  authorizedUser.attempts &&
                                  authorizedUser.attempts.length > 0
                                ) {
                                  const lastAttempt =
                                    authorizedUser.attempts[
                                      authorizedUser.attempts.length - 1
                                    ];
                                  return `${lastAttempt.score}%`;
                                }
                                return "No Attempts";
                              })()}
                            </td>
                            <td className="px-2 py-1">
                              {(() => {
                                const authorizedUser =
                                  quiz.authorizedUsers.find(
                                    (au) => au.user === user?.id
                                  );
                                if (
                                  authorizedUser &&
                                  authorizedUser.attempts &&
                                  authorizedUser.attempts.length > 0
                                ) {
                                  const last5Scores = authorizedUser.attempts
                                    .slice(-5)
                                    .map((attempt) => attempt.score ?? 0);
                                  const avg =
                                    last5Scores.reduce(
                                      (sum, score) => sum + score,
                                      0
                                    ) / last5Scores.length;
                                  return `${Math.round(avg)}%`;
                                }
                                return "No Attempts";
                              })()}
                            </td>
                            <td className="px-2 py-1 flex gap-2 justify-center text-lg text-zinc-600">
                              {quiz.authorizedUsers.some(
                                (au) =>
                                  au.user === user?.id &&
                                  au.permission === "write"
                              ) && (
                                <>
                                  <a
                                    href={`/quizzes/${quiz._id}/edit`}
                                    title="Edit Quiz"
                                  >
                                    <BiEdit className="cursor-pointer hover:text-blue-500 w-8 h-8 hover:scale-105 duration-300" />
                                  </a>
                                  <CgTrash
                                    className="cursor-pointer hover:text-red-500 w-8 h-8 hover:scale-105 duration-300"
                                    title="Remove Shared Quiz"
                                    onClick={() => setSelectedQuiz(quiz)}
                                  />
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      {userQuizzes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-2">
                            No quizzes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-1/6 py-5 pr-5 not-lg:w-[200px]">
        <div className="w-full flex flex-col h-full">
          <div className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-5 justify-between select-none">
            <h2>FILTERS & ACTIONS</h2>
          </div>
          <div className="h-full border-x border-b rounded-b border-zinc-200 p-3 gap-2 flex flex-col">
            <button
              className="w-full cursor-pointer px-2 py-1 bg-amber-100 shadow rounded-lg hover:bg-amber-200 hover:scale-105 duration-300"
              onClick={() => setIsCreateQuizModalOpen(true)}
            >
              Create Quiz
            </button>
            <button
              className="w-full cursor-pointer px-2 py-1 bg-amber-100 shadow rounded-lg hover:bg-amber-200 hover:scale-105 duration-300"
              onClick={() => setIsYourQuizzesHidden(!isYourQuizzesHidden)}
            >
              {!isYourQuizzesHidden ? "Hide" : "Show"} Your Quizzes
            </button>
            <button
              className="w-full cursor-pointer px-2 py-1 bg-amber-100 shadow rounded-lg hover:bg-amber-200 hover:scale-105 duration-300"
              onClick={() =>
                setIsArchivedQuizzesHidden(!isArchivedQuizzesHidden)
              }
            >
              {!isArchivedQuizzesHidden ? "Hide" : "Show"} Archived Quizzes
            </button>
            <button
              className="w-full cursor-pointer px-2 py-1 bg-amber-100 shadow rounded-lg hover:bg-amber-200 hover:scale-105 duration-300"
              onClick={() => setIsSharedQuizzesHidden(!isSharedQuizzesHidden)}
            >
              {!isSharedQuizzesHidden ? "Hide" : "Show"} Shared Quizzes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizesPage;
