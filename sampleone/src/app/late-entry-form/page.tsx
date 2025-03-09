"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold">Late Entry Form</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Reason for Late Entry:
                    <textarea
                        className="w-full p-2 border rounded mt-1"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        disabled={loading} // Prevent editing while submitting
                    />
                </label>
                <button 
                    type="submit" 
                    className={`mt-2 px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
            {message && <p className={`text-sm mt-2 ${message.includes("Failed") ? "text-red-500" : "text-green-600"}`}>{message}</p>}
        </div>
    );
};

export default LateEntryForm;
