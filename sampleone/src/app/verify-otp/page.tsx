"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Clock, CheckCircle, Loader2 } from "lucide-react";

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [loading, setLoading] = useState(false);
  const otpSent = useRef(false);

  useEffect(() => {
    if (email && !otpSent.current) {
      axios.post("http://127.0.0.1:8000/send-otp", { email });
      otpSent.current = true;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/verify-otp", { email, otp });
      router.push(`/password-setup?email=${email}`);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Verification failed");
    } finally {
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

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="fixed inset-0 bg-gradient-to-b from-emerald-50 to-white z-0"></div>
      
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
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">OTP Verification</h2>
            <p className="mt-2 text-gray-600">
              Please enter the verification code sent to
            </p>
            <p className="text-emerald-600 font-medium text-lg mt-1">{email}</p>
          </div>

          <div className="p-6">
            <motion.div className="space-y-6" variants={itemVariants}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    className="block w-full p-4 text-center text-2xl tracking-widest font-mono border border-gray-300 rounded-lg  bg-white text-gray-900"
                    placeholder="● ● ● ● ● ●"
                  />
                </div>
              </div>

              <motion.button
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleVerify}
                disabled={loading || timeLeft <= 0 || otp.length < 6}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Verify OTP
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center mt-4 space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <p className={`text-base ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-500'}`}>
                  Time remaining: <span className="font-medium">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </p>
              </div>

              {timeLeft <= 0 && (
                <div className="text-center text-red-500 text-sm">
                  Time expired. Please request a new OTP.
                </div>
              )}

              <div className="text-center text-sm text-gray-500 mt-4">
                Didn't receive the code?{' '}
                <button
                  className="text-emerald-600 font-medium hover:text-emerald-500"
                  onClick={() => {
                    if (email) {
                      axios.post("http://127.0.0.1:8000/send-otp", { email });
                      setTimeLeft(180);
                      alert("New OTP sent!");
                    }
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;