import { useAuth } from "../auth/AuthContext";
import { NavLink } from "react-router";

type User = { id: string; email: string; name?: string; createdAt?: string };

function ApiPage() {
  const {
    user,
    isAuthed,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshProfile,
  } = useAuth();

  const demoEmail = "email@email.com";
  const demoPass = "password";

  return (
    <div className="flex-1 h-full bg-yellow-50 p-6">
      <button
        className="hover:bg-yellow-50 px-2 py-1 cursor-pointer"
        onClick={() => register(demoEmail, demoPass, "Alice")}
      >
        Register
      </button>
      <button
        className="hover:bg-yellow-50 px-2 py-1 cursor-pointer"
        onClick={() => login(demoEmail, demoPass)}
      >
        Login
      </button>
      {isLoading ? (
        <p>Loading…</p>
      ) : isAuthed ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p className="text-sm text-zinc-700">Not signed in.</p>
      )}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export default ApiPage;
