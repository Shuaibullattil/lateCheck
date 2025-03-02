"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form from reloading the page

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", { username, password });

      if (res.status === 200 && res.data.detail) {
        localStorage.setItem("user", JSON.stringify(res.data.detail));
        router.push("/home"); // Redirect after successful login
      } else {
        alert("Invalid login credentials!");
      }
    } catch (error) {
      alert("Invalid username or password! from front");
    }
  };

  return (
    <div className="mx-auto mt-10 w-64">
      <form onSubmit={handleLogin}> {/* Use onSubmit for form handling */}
        <div>
          <label className="block text-gray-800 font-semibold text-sm">Email</label>
          <div className="mt-2">
            <input
              type="text"
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">Password</label>
          <div className="mt-2">
            <input
              type="password"
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-neutral mt-5 w-56">
          Login
        </button>
      </form>

      <a href="/register" className="btn btn-active btn-link">Create Account</a>
    </div>
  );
}
