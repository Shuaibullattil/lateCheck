"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const LateEntryForm = () => {
    const router = useRouter();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.replace("/"); // Redirect if no user
        }
    }, [router]);

    if (!user) return null; // Prevent rendering until user is determined
    const requestData = {
        name: user?.name,
        hostel_id: user?.details?.hostel_id,
        purpose: reason,
    };
    
    console.log("Sending Data:", requestData);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
    
        try {
            const response = await axios.post(
                "http://localhost:8000/update/history",
                {
                    name :user?.name,
                    hostel_id: user?.details?.hostel_id,
                    purpose: reason.trim(),
                },
                {
                    headers: { "Content-Type": "application/json" }, // Ensure JSON format
                }
            );
    
            console.log("API Response:", response.data); // Debugging
            setMessage(response.data.message || "Late entry recorded successfully!");
            alert("Late entry recorded successfully!");
            router.push("/home");
        } catch (error: any) {
            console.error("API Error:", error.response?.data || error.message || error);
    
            setMessage(
                error.response?.data?.message ||
                "Failed to insert history. Check the console for details."
            );
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen bg-[#f1fdf3]">
          {/* Fixed Header */}
          <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-10">
              <button
                onClick={() => router.push("/home")}
                className="flex items-center gap-2 text-green-600 hover:text-green-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="text-green-700 font-bold text-xl">Late Entry Form</div>
            </div>
          </header>
    
          {/* Main Content */}
          <main className="flex flex-col flex-1 justify-center items-center pt-20 pb-10 px-4">
            <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full space-y-6">
              <div className="text-center text-green-700 font-semibold text-xl">
                <h2>Reason for Late Entry</h2>
              </div>
    
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reason for Late Entry Input */}
                <div className="space-y-2">
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter your reason here..."
                    rows={5}
                    disabled={loading}
                    className="w-full p-3 rounded-lg border border-green-300 bg-[#f1fdf3] text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
    
                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
              {message && <p className={`text-sm mt-2 ${message.includes("Failed") ? "text-red-500" : "text-green-600"}`}>{message}</p>}
            </div>
          </main>
    
          {/* Footer Navigation */}
          <footer className=" fixed bottom-0 left-0 w-full p-3 z-50">
                  <div className="flex justify-center">
                    <MenuButton />
                  </div>
                </footer>
        </div>
      );
};

export default LateEntryForm;


