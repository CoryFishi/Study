import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    description: { type: String, default: "" },
    questions: {
      type: Array<{
        _id: string;
        question: string;
        answer: string;
        wrongAnswers: string[];
      }>,
      default: [],
    },
    authorizedUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, enum: ["read", "write"], default: "read" },
        attempts: [
          {
            correct: [{ question: { type: String }, answer: { type: String } }],
            incorrect: [
              { question: { type: String }, answer: { type: String } },
            ],
            score: { type: Number, min: 0, max: 100 },
            date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    category: { type: String, default: "User" },
    tags: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", QuizSchema);
