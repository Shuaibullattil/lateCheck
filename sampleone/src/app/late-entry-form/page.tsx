"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LateEntryForm = () => {
    const router = useRouter();
    const [reason, setReason] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("https://192.168.1.8:3000/home");
        alert(`Late Entry Reason: ${reason}`);
        // Send to backend or store in DB
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
            />
            </label>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Submit
            </button>
        </form>
        </div>
    );
    };

    export default LateEntryForm;
