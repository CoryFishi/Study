import "./App.css";
import React from "react";

function App() {
  const email = "email@email.com";
  const password = "password";
  const name = "name";

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch("http://localhost:4000/app/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const { token, user } = await res.json();

    localStorage.setItem("token", token);
    console.log("registered user:", user);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:4000/app/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const { token, user } = await res.json();

    localStorage.setItem("token", token);
    console.log("logged in user:", user);
  };

  return (
    <div className="h-screen bg-zinc-50 flex flex-col">
      <div className="sticky top-0 bg-yellow-100 shadow p-2 px-10 items-center flex w-full h-16 justify-between">
        <div>
          <h1 className="text-xl font-bold"></h1>
        </div>
        <div className="flex gap-3">
          <button
            className="hover:bg-zinc-300 px-2 py-1 cursor-pointer"
            onClick={() => register(email, password, name)}
          >
            API
          </button>
          <button
            className="hover:bg-zinc-300 px-2 py-1 cursor-pointer"
            onClick={() => login(email, password)}
          >
            Study
          </button>
          <button className="bg-yellow-50 border hover:bg-yellow-200 px-2 py-1 rounded-lg border-zinc-200 cursor-pointer">
            email@email.com
          </button>
        </div>
      </div>
      <div className="flex-1 h-full bg-yellow-50"></div>
    </div>
  );
}

export default App;
