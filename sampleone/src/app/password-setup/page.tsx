"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function PasswordSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!Email) {
      alert("Invalid access. Redirecting...");
      router.replace("/");
    }
  }, [Email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/set-password", {
        email: Email,
        password,
      });

      alert("Password set successfully!");
      router.push("/"); // Redirect to login page
    } catch (error) {
      console.error("Error setting password:", error);
      alert("Failed to set password!");
    }
  };

  return (
    <div className="mx-auto mt-10 w-64">
      <h2 className="text-lg font-semibold mb-3">Set Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-gray-400 focus:text-gray-800 mb-3"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Confirm Password:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-gray-400 focus:text-gray-800 mb-3"
          />
        </div>

        <button type="submit" className="btn btn-neutral mt-5 w-56">
          Set Password
        </button>
      </form>
    </div>
  );
}
