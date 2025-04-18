"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Phone, Mail, BookOpen, CalendarClock, Home, Loader2, ArrowRight, CheckCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeField, setActiveField] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    phoneno: "",
    email: "",
    branch: "",
    semester: "",
    hostel: "",
    address: "N/A",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFieldFocus = (field: string) => {
    setActiveField(field);
  };

  const handleFieldBlur = () => {
    setActiveField("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://127.0.0.1:8000/add/user", null, {
        params: {
          name: formData.name,
          address: formData.address,
          email: formData.email,
          hostel: formData.hostel,
          sem: formData.semester,
          branch: formData.branch,
          phone_no: formData.phoneno,
          student_id: formData.student_id,
        },
      });
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/verify-otp?email=${formData.email}`);
      }, 1200);
    } catch (error: unknown) {
      setIsSubmitting(false);
      if (axios.isAxiosError(error)) {
        showErrorMessage(error.response?.data?.detail || "Registration failed!");
      } else {
        showErrorMessage("An unexpected error occurred!");
      }
    }
  };

  const showErrorMessage = (message: string) => {
    const toast = document.createElement("div");
    toast.className = "fixed top-4 right-4 bg-white text-red-600 p-3 rounded-lg shadow-lg z-50 flex items-center";
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

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.05
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
      
      {showSuccess && (
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
            <h2 className="text-xl font-medium text-gray-900">Registration Successful</h2>
            <p className="text-gray-600 text-base">Redirecting to OTP verification...</p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-4xl z-10 p-6"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-3">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Student Registration</h1>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${activeField === "name" ? "text-emerald-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus("name")}
                    onBlur={handleFieldBlur}
                    required
                    className="block w-full pl-10 pr-3 py-3 focus:border-none focus:outline-none text-base border border-gray-200 rounded-lg  bg-white text-gray-900"
                    placeholder="Full name"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeField === "name" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>

              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className={`h-5 w-5 ${activeField === "student_id" ? "text-emerald-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus("student_id")}
                    onBlur={handleFieldBlur}
                    required
                    className="block w-full pl-10 pr-3 py-3 text-base border focus:border-none focus:outline-none border-gray-200 rounded-lg  bg-white text-gray-900"
                    placeholder="Student ID"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeField === "student_id" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>

              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className={`h-5 w-5 ${activeField === "phoneno" ? "text-emerald-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    name="phoneno"
                    value={formData.phoneno}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus("phoneno")}
                    onBlur={handleFieldBlur}
                    required
                    className="block w-full pl-10 pr-3 py-3 text-base focus:border-none focus:outline-none border border-gray-200 rounded-lg  bg-white text-gray-900"
                    placeholder="Phone number"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeField === "phoneno" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>

              <motion.div className="col-span-1" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${activeField === "email" ? "text-emerald-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFieldFocus("email")}
                    onBlur={handleFieldBlur}
                    required
                    className="block w-full pl-10 pr-3 py-3 text-base focus:border-none focus:outline-none border border-gray-200 rounded-lg  bg-white text-gray-900"
                    placeholder="Email address"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeField === "email" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>

              <motion.div className="col-span-2 grid grid-cols-3 gap-5" variants={itemVariants}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className={`h-5 w-5 ${activeField === "branch" ? "text-emerald-500" : "text-gray-400"}`} />
                    </div>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      onFocus={() => handleFieldFocus("branch")}
                      onBlur={handleFieldBlur}
                      required
                      className="block w-full pl-10 pr-8 py-3 focus:border-none focus:outline-none text-base border border-gray-200 rounded-lg  bg-white text-gray-900 appearance-none"
                    >
                      <option value="">Branch</option>
                      <option value="CS">CS</option>
                      <option value="IT">IT</option>
                      <option value="EEE">EEE</option>
                      <option value="EC">EC</option>
                      <option value="CE">CE</option>
                      <option value="SE">SE</option>
                      <option value="ME">ME</option>
                    </select>
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeField === "branch" ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarClock className={`h-5 w-5 ${activeField === "semester" ? "text-emerald-500" : "text-gray-400"}`} />
                    </div>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      onFocus={() => handleFieldFocus("semester")}
                      onBlur={handleFieldBlur}
                      required
                      className="block w-full pl-10 pr-8 py-3 focus:border-none focus:outline-none text-base border border-gray-200 rounded-lg  bg-white text-gray-900 appearance-none"
                    >
                      <option value="">Semester</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeField === "semester" ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className={`h-5 w-5 ${activeField === "hostel" ? "text-emerald-500" : "text-gray-400"}`} />
                    </div>
                    <select
                      name="hostel"
                      value={formData.hostel}
                      onChange={handleChange}
                      onFocus={() => handleFieldFocus("hostel")}
                      onBlur={handleFieldBlur}
                      required
                      className="block w-full pl-10 pr-8 py-3 focus:border-none focus:outline-none text-base border border-gray-200 rounded-lg  bg-white text-gray-900 appearance-none"
                    >
                      <option value="">Hostel</option>
                      <option value="swaraj">Swaraj</option>
                      <option value="sahara">Sahara</option>
                      <option value="sagar">Sagar</option>
                      <option value="sarover">Sarover</option>
                    </select>
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeField === "hostel" ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="col-span-2 mt-4"
                variants={itemVariants}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Register
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
        
        <motion.div 
          className="mt-4 text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign in
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}