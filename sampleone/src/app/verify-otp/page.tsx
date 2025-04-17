"use client";

import { useSearchParams, useRouter, } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

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
  }, [email])

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

  return (
    <div className="mx-auto mt-10 w-64">
      <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
      <p className="mb-2">Sent to {email}</p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        className="w-56 p-2 ring-1 ring-gray-400 mb-3"
        placeholder="Enter OTP"
      />
      <button
        className="btn btn-primary w-56 mb-3"
        onClick={handleVerify}
        disabled={loading || timeLeft <= 0}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      <p className="text-gray-500">Time left: {timeLeft}s</p>
    </div>
  );
};

export default VerifyOtp;
