"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, KeyRound, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PasswordSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (!Email) {
      alert("Invalid access. Redirecting...");
      router.replace("/");
    }
  }, [Email, router]);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length > 0) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);

    // Check if passwords match
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/set-password", {
        email: Email,
        password,
      });

      // Show success briefly before redirecting
      setTimeout(() => {
        router.push("/"); // Redirect to login page
      }, 1500);
    } catch (error) {
      console.error("Error setting password:", error);
      alert("Failed to set password!");
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="fixed inset-0 bg-gradient-to-b from-emerald-50 to-white z-0"></div>
      
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h2 className="text-xl font-medium text-gray-900">Password Set Successfully</h2>
            <p className="text-gray-600 text-base">Redirecting to login page...</p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-md z-10 p-8"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="px-6 py-6 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <KeyRound className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Set Your Password</h2>
            <p className="mt-2 text-gray-600">
              Create a secure password for your account
            </p>
            <p className="text-emerald-600 font-medium text-lg mt-1">{Email}</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-gray-900"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength < 2 ? "text-red-500" : 
                        passwordStrength < 4 ? "text-yellow-500" : "text-green-500"
                      }`}>{getStrengthText()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()}`} 
                        style={{ width: `${passwordStrength * 20}%` }}
                      ></div>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-gray-500">
                      <li className={`flex items-center ${password.length >= 8 ? "text-green-500" : ""}`}>
                        <div className={`w-1 h-1 rounded-full mr-1.5 ${password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}></div>
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-500" : ""}`}>
                        <div className={`w-1 h-1 rounded-full mr-1.5 ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                        At least one uppercase letter
                      </li>
                      <li className={`flex items-center ${/[0-9]/.test(password) ? "text-green-500" : ""}`}>
                        <div className={`w-1 h-1 rounded-full mr-1.5 ${/[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                        At least one number
                      </li>
                      <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? "text-green-500" : ""}`}>
                        <div className={`w-1 h-1 rounded-full mr-1.5 ${/[^A-Za-z0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`block w-full pl-10 pr-10 py-3 text-base border ${!passwordMatch ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500"} rounded-lg bg-white text-gray-900`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {!passwordMatch && confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Passwords do not match
                  </p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!password || !confirmPassword || !passwordMatch || loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Setting Password...
                  </>
                ) : (
                  "Set Password & Continue"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}