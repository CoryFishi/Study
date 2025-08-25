import { Suspense, lazy, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./auth/AuthContext";
import UserSettingsPage from "./pages/UserSettingsPage";
import QuizesPage from "./pages/QuizesPage";

// code-split pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ApiPage = lazy(() => import("./pages/ApiPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const { user, logout, login } = useAuth();
  const [isAccountNavOpen, setIsAccountNavOpen] = useState(false);
  const demoEmail = "email@email.com";
  const demoPass = "password";
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
          <NavLink
            className="hover:bg-yellow-50 px-2 py-1 cursor-pointer"
            to="/quizes"
          >
            Quizes
          </NavLink>
          <div
            className="relative select-none"
            onClick={() => {
              if (user) {
                setIsAccountNavOpen(!isAccountNavOpen);
              } else {
                login(demoEmail, demoPass);
              }
            }}
          >
            <button
              className="bg-yellow-50 border px-2 py-1 rounded-lg border-zinc-200 cursor-pointer hover:bg-yellow-200"
              onClick={() =>
                user
                  ? setIsAccountNavOpen(!isAccountNavOpen)
                  : login(demoEmail, demoPass)
              }
            >
              {user?.email ?? "Login/Register"}
            </button>

            {isAccountNavOpen && user && (
              <div className="flex flex-col text-center absolute left-0 right-0 top-full bg-yellow-50 z-50 rounded border-zinc-200 border select-none">
                <NavLink
                  className="hover:bg-yellow-200 px-2 py-1 w-full cursor-pointer"
                  to="/user-settings"
                >
                  User Settings
                </NavLink>
                <button
                  className="hover:bg-yellow-200 px-2 py-1 w-full cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Routes */}
      <main className="flex flex-1 bg-yellow-50">
        <Suspense fallback={<p>Loading…</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/user-settings" element={<UserSettingsPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/quizes" element={<QuizesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
