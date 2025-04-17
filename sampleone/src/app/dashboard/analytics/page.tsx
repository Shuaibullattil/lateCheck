"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../../components/user/menubutton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!user) return null;

  // Sample data
  const todayLateEntries = 7;
  const commonReason = "Missed Shuttle";
  const weeklyData = [3, 5, 2, 6, 4, 7, 5];
  const averageTimes = [10, 12, 8, 15, 9, 14, 11];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const topOffender = {
    name: "Arjun R",
    description: "Final-year CSE student. Repeated late entry due to club activities.",
    details: "5 entries this week • Avg delay: 17 mins • Hostel: Men’s Block C",
  };

  const reportHandler = () => {
    alert("PDF Report Generated!");
  };

  return (
    <div className="min-h-screen bg-[#f1fdf3] text-gray-800 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-[64px]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between h-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">LateCheck</h1>
          <span className="text-gray-600 text-sm">Analytics • {user?.name}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[80px] pb-20 px-4 sm:px-8 overflow-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-6">
          {/* Today’s Entries */}
          <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-green-400">
            <h2 className="text-xl font-bold text-green-700">Today’s Late Entries</h2>
            <p className="text-4xl mt-4 font-bold text-gray-900">{todayLateEntries}</p>
          </div>

          {/* Common Reason */}
          <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-green-400">
            <h2 className="text-xl font-bold text-green-700">Most Common Reason</h2>
            <p className="text-lg mt-4 text-gray-700">{commonReason}</p>
          </div>

          {/* Report Generator */}
          <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-green-400">
            <h2 className="text-xl font-bold text-green-700 mb-4">Generate Report</h2>
            <button
              onClick={reportHandler}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Download Report 📄
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md border border-green-300 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-800 mb-4 text-center">Late Entries (Last 7 Days)</h2>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: "Entries",
                    data: weeklyData,
                    backgroundColor: "#4ade80",
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>

          <div className="bg-white shadow-md border border-green-300 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-800 mb-4 text-center">Avg Late Time (mins)</h2>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Minutes Late",
                    data: averageTimes,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.2)",
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Offender */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-white border border-green-400 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-green-800 text-center mb-4">Most Frequent Late Entry</h2>
            <p className="text-2xl font-semibold text-center text-gray-800">{topOffender.name}</p>
            <p className="text-gray-600 text-center mt-2">{topOffender.description}</p>
            <p className="text-gray-500 text-center text-sm mt-1">{topOffender.details}</p>
          </div>
        </div>
      </main>

      {/* Footer Dock */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow z-50 p-3">
        <div className="flex justify-center">
          <MenuButton />
        </div>
      </footer>
    </div>
  );
}
