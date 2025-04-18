"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Animation trigger when component mounts
  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", { username, password });

      if (res.status === 200 && res.data.token) {
        setShowSuccess(true);
        
        if (res.data.detail.usertype === "warden") {
          localStorage.setItem("warden", JSON.stringify(res.data.detail));
          localStorage.setItem("token", res.data.token);
        } else {
          localStorage.setItem("user", JSON.stringify(res.data.detail));
          localStorage.setItem("token", res.data.token);
        }

        // Delay redirect to show success animation
        setTimeout(() => {
          if (res.data.user && res.data.user.usertype === "warden") {
            router.push("/dashboard/analytics");
          } else {
            router.push("/home");
          }
        }, 1200);
      } else {
        setIsLoading(false);
        showErrorMessage("Invalid login credentials");
      }
    } catch (error) {
      setIsLoading(false);
      showErrorMessage("Invalid username or password");
    }
  };

  const handleFieldFocus = (field) => {
    setActiveField(field);
  };

  const handleFieldBlur = () => {
    setActiveField("");
  };

  const showErrorMessage = (message) => {
    const toast = document.createElement("div");
    toast.className = "fixed top-4 right-4 bg-white text-red-600 p-4 rounded-lg shadow-lg z-50 flex items-center";
    toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "opacity 0.3s, transform 0.3s";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      {/* Simple gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-emerald-50 to-white z-0"></div>

      {/* Success message overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Login Successful</h2>
              <p className="text-gray-600">Redirecting to your dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
              <Lock className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to continue to your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${activeField === "username" ? "text-emerald-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => handleFieldFocus("username")}
                      onBlur={handleFieldBlur}
                      className="block w-full pl-10 pr-3 py-3 border focus:outline-none border-b border-gray-200 focus:border-none rounded-lg  bg-white text-gray-900"
                      placeholder="Enter your username"
                      required
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeField === "username" ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${activeField === "password" ? "text-emerald-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => handleFieldFocus("password")}
                      onBlur={handleFieldBlur}
                      className="block w-full pl-10 pr-3 py-3 border focus:outline-none border-b border-gray-200 focus:border-none rounded-lg  bg-white text-gray-900"
                      placeholder="Enter your password"
                      required
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeField === "password" ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Forgot password?
                </a>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Signing in
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">
                  Don't have an account?{" "}
                </span>
                <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Create one now
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <Lock className="h-3 w-3 mr-1" />
            Secure Login
          </p>
        </div>
      </motion.div>
    </div>
  );
}