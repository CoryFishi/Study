import { Suspense, lazy } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./auth/AuthContext";

// code-split pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ApiPage = lazy(() => import("./pages/ApiPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Header / Nav */}
      <div className="sticky top-0 bg-yellow-100 shadow p-2 px-10 items-center flex w-full h-16 justify-between">
        <div>
          <NavLink to="/" className="text-xl font-bold">
            Flashcards
          </NavLink>
        </div>
        <div className="flex gap-3 items-center">
          <NavLink
            to="/api"
            className="hover:bg-yellow-50 px-2 py-1 cursor-pointer"
          >
            API
          </NavLink>
          <NavLink
            className="hover:bg-yellow-50 px-2 py-1 cursor-pointer"
            to="/flashcards"
          >
            Flashcards
          </NavLink>
          <button
            className="bg-yellow-50 border hover:bg-yellow-200 px-2 py-1 rounded-lg border-zinc-200 cursor-pointer"
            onClick={logout}
          >
            {user?.email ?? "Login/Register"}
          </button>
        </div>
      </div>

      {/* Routes */}
      <main className="flex-1 bg-yellow-50">
        <Suspense fallback={<p>Loading…</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
