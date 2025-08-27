import express from "express";
import { Quiz } from "../models/Quiz";
import { User } from "../models/User";

export const appRouter = express.Router();

// Health Check
appRouter.get("/health", (_req, res) => res.json({ ok: true }));

appRouter.post("/quizzes", async (req, res) => {
  const { title, description, authorId } = req.body || {};
  if (!title || !authorId)
    return res.status(400).json({
      code: "BAD_INPUT",
      message: "title & authorId required",
    });
  const quiz = await Quiz.create({
    title,
    description: description ?? "",
    createdBy: authorId,
    authorizedUsers: [
      {
        user: authorId,
        permission: "write",
        attempts: [
          //  // Incase we want to debug scores
          //   {
          //     correct: { question: "Wwwww", answer: "A" },
          //     incorrect: { question: "Xxxxx", answer: "B" },
          //     score: 100,
          //     date: new Date(),
          //   },
          //   {
          //     correct: { question: "Wwwww", answer: "A" },
          //     incorrect: { question: "Xxxxx", answer: "B" },
          //     score: 10,
          //     date: new Date(),
          //   },
          //   {
          //     correct: { question: "Wwwww", answer: "A" },
          //     incorrect: { question: "Xxxxx", answer: "B" },
          //     score: 10,
          //     date: new Date(),
          //   },
          //   {
          //     correct: { question: "Wwwww", answer: "A" },
          //     incorrect: { question: "Xxxxx", answer: "B" },
          //     score: 10,
          //     date: new Date(),
          //   },
        ],
      },
    ],
  });
  res.status(201).json({
    quiz,
  });
});

appRouter.get("/quizzes", async (req, res) => {
  const userId = (req as any).user.id;
  const user = await User.findById(userId)
    .select("_id email name createdAt")
    .lean();
  if (!user)
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "User not found" });

  const quizzes = await Quiz.find({ "authorizedUsers.user": userId });
  const userQuizzes = quizzes.filter(
    (quiz) =>
      quiz.category.toString() === "User" &&
      quiz.createdBy?.toString() === userId
  );
  const archivedQuizzes = quizzes.filter(
    (quiz) =>
      quiz.category.toString() === "Archived" &&
      quiz.createdBy?.toString() === userId
  );
  const sharedQuizzes = quizzes.filter(
    (quiz) => quiz.createdBy?.toString() !== userId
  );
  res.json({
    userQuizzes: userQuizzes,
    archivedQuizzes: archivedQuizzes,
    sharedQuizzes: sharedQuizzes,
  });
});

appRouter.delete("/quizzes/:id", async (req, res) => {
  const quizId = req.params.id;
  const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
  if (!deletedQuiz)
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Quiz not found",
    });
  res.json({
    quiz: deletedQuiz,
  });
});

appRouter.put("/quizzes/:id/archive", async (req, res) => {
  const quizId = req.params.id;
  const archivedQuiz = await Quiz.findByIdAndUpdate(quizId, {
    category: "Archived",
  });
  if (!archivedQuiz)
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Quiz not found",
    });
  res.json({
    quiz: archivedQuiz,
  });
});

appRouter.put("/quizzes/:id/unarchive", async (req, res) => {
  const quizId = req.params.id;
  const unarchivedQuiz = await Quiz.findByIdAndUpdate(quizId, {
    category: "User",
  });
  if (!unarchivedQuiz)
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Quiz not found",
    });
  res.json({
    quiz: unarchivedQuiz,
  });
});

appRouter.get("/quizzes/:id", async (req, res) => {
  const quizId = req.params.id;
  const quiz = await Quiz.findById(quizId);
  if (!quiz)
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Quiz not found",
    });
  res.json({
    quiz: quiz,
  });
});
