"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Menu,
  X,
  Home, 
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Bell,
  LogOut,
  User,
  Download,
  Clock,
} from "lucide-react";
import axios from "axios";
import router from "next/router";


interface LateEntryStats {
  lateEntriesToday: number;
  mostFrequentReason: string;
  reasonCount?: number; // Count of the most frequent reason
}


const mockData = {
  lateEntriesToday: 12,
  mostFrequentReason: "Missed the bus",
  avgLateTime: [
    { day: "Mon", time: 8 },
    { day: "Tue", time: 10 },
    { day: "Wed", time: 6 },
    { day: "Thu", time: 9 },
    { day: "Fri", time: 11 },
    { day: "Sat", time: 7 },
    { day: "Sun", time: 5 },
  ],
  lateEntriesWeek: [
    { day: "Mon", entries: 5 },
    { day: "Tue", entries: 7 },
    { day: "Wed", entries: 14 },
    { day: "Thu", entries: 6 },
    { day: "Fri", entries: 10 },
    { day: "Sat", entries: 8 },
    { day: "Sun", entries: 3 },
  ],
};

const handleLogout = () =>{
  localStorage.removeItem("warden")
};

const sidebarItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Student Details", icon: Users, href: "/studentdetail" },
    { name: "Requests", icon: FileText, href: "/dashboard/student-request" },
    { name: "Messages", icon: MessageSquare, href: "/dashboard/student-messages" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Logout", icon: LogOut, href: "/" },
  ];

// Modal Component
// Modal Component
const ProfileModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        {/* Header with student info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mr-3 shadow-md">
              {student.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
              <p className="text-sm text-gray-500">{student?.batch}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-green-100 via-green-500 to-green-100 my-4"></div>
        
        {/* Content */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-xl">
              <p className="text-xs text-green-700 font-medium mb-1">Room Number</p>
              <p className="font-semibold text-gray-800">{student?.attendance}%</p>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-xl">
              <p className="text-xs text-amber-700 font-medium mb-1">Late Count</p>
              <p className="font-semibold text-gray-800">{student?.lateCount}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm font-medium text-gray-700">Late Reasons:</p>
            <p className="text-sm text-gray-600">{student?.reason}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm font-medium text-gray-700">Contact:</p>
            <p className="text-sm text-gray-600">{student?.contactInfo}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm font-medium text-gray-700">Notes:</p>
            <p className="text-sm italic text-gray-600">{student?.notes || "No additional notes"}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [mystudents,setMYStudents] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<LateEntryStats>({
    lateEntriesToday: 0,
    mostFrequentReason: 'Loading...',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch late entries count (assuming you have this endpoint)
        const lateEntriesResponse = await axios.get('http://localhost:8000/students/today');
        
        // Fetch most common reason using your endpoint
        const reasonResponse = await axios.get<{most_common_reason: string; count: number}>('http://localhost:8000/most-common-late-reason/');
        
        setStats({
          lateEntriesToday: lateEntriesResponse.data.count || 0,
          mostFrequentReason: reasonResponse.data.most_common_reason,
          reasonCount: reasonResponse.data.count
        });

        setMYStudents(lateEntriesResponse.data.entries);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch late entry statistics:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Call the report generation endpoint
      const response = await axios({
        url: 'http://localhost:8000/generate-report-from-file/',
        method: 'GET',
        responseType: 'blob', // Important for downloading files
      });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'late-entry-report.pdf';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Failed to download report. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };


    
        useEffect(() => {
            if (typeof window === "undefined") return;
    
            const storedUser = localStorage.getItem("warden");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
    
                // Redirect if not a warden
                if (parsedUser.usertype !== "warden") {
                    router.replace("/");
                }
            } else {
                router.replace("/");
            }
        }, [router]);
    
        if (!user || user.usertype !== "warden") return null;

  const openStudentProfile = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  
  return (
    <div className="h-screen flex bg-[#f1fdf3] text-gray-800 overflow-hidden">
      {/* Sidebar - fixed */}
      <div
        className={`fixed top-0 bottom-0 left-0 bg-white border-r border-green-200 w-64 space-y-4 py-6 px-4 overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button className="absolute top-4 right-4 md:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="text-green-700" />
        </button>
        <h1 className="text-xl font-bold text-green-800 mb-4">LateCheck</h1>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map(({ name, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                onClick={name === "Logout" ? handleLogout : undefined}
                
                className={`flex items-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 text-left ${
                  isActive
                    ? "bg-green-200 text-green-800"
                    : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-md p-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="text-green-700" />
            </button>
            <h2 className="text-2xl font-bold text-green-800 ml-4 md:ml-2">Welcome {user.name}</h2>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 sm:p-4 md:p-6 flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Layout grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column - Student profiles and late entry stats */}
              <div className="space-y-4">
                {/* Consolidated Late Entry Stats Component */}
                <div className="bg-white border border-green-300 shadow-md rounded-xl p-7">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Late Entries Today
                    </h3>
                  <button 
                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors relative"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-t-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Loading data...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <p className="text-3xl font-bold text-gray-700">{stats.lateEntriesToday}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">Most Common Reason:</p>
                        <p className="text-sm font-medium text-gray-800">
                          {stats.mostFrequentReason}
                          {stats.reasonCount && (
                            <span className="ml-1 text-gray-500">({stats.reasonCount} occurrences)</span>
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Student Profiles Component */}
                <div className="bg-white border border-green-300 shadow-md rounded-xl px-4 py-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2" /> 
                    Recent Late Students
                  </h3>
                  <div className="space-y-1">
                    {mystudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => openStudentProfile(student)}
                        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-green-50 transition-colors border border-gray-100"
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-medium text-xs">
                            {student.avatar}
                          </div>
                          <div className="ml-2 text-left">
                            <p className="font-medium text-sm">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.grade}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-amber-100 text-amber-800 text-xs py-0.5 px-2 rounded-full">
                            {student.lateCount} late
                          </span>
                          <User className="w-3 h-3 ml-2 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right columns - Charts */}
              <div className="lg:col-span-2 space-y-4">
                {/* Line Chart */}
                <div className="bg-white border border-green-300 shadow-md rounded-xl px-4 py-8">
                  <h3 className="text-base font-semibold text-green-800 mb-2">Average Late Entry Time (Past 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={mockData.avgLateTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="time" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white border border-green-300 shadow-md rounded-xl px-4 py-9">
                  <h3 className="text-base font-semibold text-green-800 mb-2">Late Entries (Past 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={mockData.lateEntriesWeek}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="entries" fill="#15803d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        student={selectedStudent} 
      />
    </div>
  );
}