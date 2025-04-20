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
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Bell,
  LogOut,
  Calendar,
  User,
  Download,
  Clock,
} from "lucide-react";
import axios from "axios";

interface LateEntryStats {
  lateEntriesToday: number;
  mostFrequentReason: string;
  reasonCount?: number; // Count of the most frequent reason
}

const handleLogout = () => {
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
              <p className="font-semibold text-gray-800">{student?.room_no}</p>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-xl">
              <p className="text-xs text-amber-700 font-medium mb-1">Late Count</p>
              <p className="font-semibold text-gray-800">{student?.total_late_entries}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm font-medium text-gray-700">Late Reasons:</p>
            <p className="text-sm text-gray-600">{student?.reason}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm font-medium text-gray-700">Contact:</p>
            <p className="text-sm text-gray-600">{student?.phone_no}</p>
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
  const [avgLateTime, setAvgLateTime] = useState([]);
  const [lateEntriesWeek, setLateEntriesWeek] = useState([]);
  const [mystudents, setMYStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    lateEntriesToday: 0,
    mostFrequentReason: 'Loading...',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selecting, setSelecting] = useState(true); // true for selecting startDate, false for endDate
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);

  // Generate days for the current month view
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, date: new Date(year, month, i) });
    }
    
    return days;
  };

  // Calculate days for the current month
  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch late entries count
        const lateEntriesResponse = await axios.get('http://localhost:8000/students/today'{
          params :{
            hostel : user.hostel,
          }
        });
        const graphDatas = await axios.get('http://localhost:8000/avg/entry');
        
        // Fetch most common reason using your endpoint
        const reasonResponse = await axios.get('http://localhost:8000/most-common-late-reason/');
        
        setStats({
          lateEntriesToday: lateEntriesResponse.data.count || 0,
          mostFrequentReason: reasonResponse.data.most_common_reason,
          reasonCount: reasonResponse.data.count
        });

        setMYStudents(lateEntriesResponse.data.entries);
        setAvgLateTime(graphDatas.data.avgLateTime);
        setLateEntriesWeek(graphDatas.data.lateEntriesWeek);
        
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

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const openCalendar = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setSelecting(true);
    setShowCalendar(true);
  };
  
  const handleDayClick = (date) => {
    if (!date) return;
    
    if (selecting) {
      // Setting start date
      setTempStartDate(date);
      setTempEndDate(null);
      setSelecting(false);
    } else {
      // Setting end date
      if (date < tempStartDate) {
        // If selected date is before start date, swap them
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
      setSelecting(true);
    }
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const isInRange = (date) => {
    if (!tempStartDate || !date) return false;
    if (!tempEndDate) return date.getTime() === tempStartDate.getTime();
    return date >= tempStartDate && date <= tempEndDate;
  };
  
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const clearDateRange = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setSelecting(true);
  };

  const cancelSelection = () => {
    setShowCalendar(false);
  };
  
  const applyDateRange = async () => {
    // Save the temp dates to the actual state
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    
    setShowCalendar(false);
    
    if (!tempStartDate || !tempEndDate) {
      console.warn("Start or end date is missing.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.get('http://localhost:8000/filter/date', {
        params: {
          start_date: tempStartDate.toISOString().split("T")[0],
          end_date: tempEndDate.toISOString().split("T")[0],
          hostel: user.hostel,
        },
      });
      
      setMYStudents(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setError("Failed to fetch filtered data");
      setIsLoading(false);
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
                <div className="bg-white h-[350px] border border-green-300 shadow-md rounded-xl px-4 py-6 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2" /> 
                    {startDate && endDate 
                      ? `Late Students (${formatDate(startDate)} - ${formatDate(endDate)})`
                      : "Today's Late Students"
                    }
                  </h3>
                  <button 
                    onClick={openCalendar}
                    className="flex items-center space-x-1 bg-white border border-green-300 rounded-lg px-3 py-1.5 text-sm text-green-800 shadow-sm mb-4 mt-2 hover:bg-green-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="hidden sm:inline">
                      {startDate && endDate 
                        ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                        : "Select dates"
                      }
                    </span>
                  </button>
                  <div className="space-y-1">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">Loading students...</p>
                      </div>
                    ) : mystudents && mystudents.length > 0 ? (
                      mystudents.map((student) => (
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
                              {student?.total_late_entries} late
                            </span>
                            <User className="w-3 h-3 ml-2 text-gray-400" />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No late students found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right columns - Charts */}
              <div className="lg:col-span-2 space-y-4">
                {/* Line Chart */}
                <div className="bg-white border border-green-300 shadow-md rounded-xl px-4 py-8">
                  <h3 className="text-base font-semibold text-green-800 mb-2">Average Late Entry Time (Past 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={avgLateTime}>
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
                    <BarChart data={lateEntriesWeek}>
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
      
      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Select Date Range</h2>
                <button onClick={cancelSelection} className="p-1 rounded-full hover:bg-green-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-sm">
                {tempStartDate && tempEndDate 
                  ? `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`
                  : tempStartDate 
                    ? `${formatDate(tempStartDate)} - Select end date`
                    : "Select start date"
                }
              </div>
            </div>
            
            {/* Calendar body */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-green-100">
                  <ChevronLeft className="w-5 h-5 text-green-700" />
                </button>
                <h4 className="font-medium text-green-800 text-lg">{monthYear}</h4>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-green-100">
                  <ChevronRight className="w-5 h-5 text-green-700" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day.date)}
                    disabled={!day.day}
                    className={`
                      w-10 h-10 flex items-center justify-center text-sm rounded-full
                      ${!day.day ? 'invisible' : 'hover:bg-green-100'}
                      ${isToday(day.date) ? 'ring-1 ring-green-500' : ''}
                      ${isInRange(day.date) ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                      ${day.date && tempStartDate && day.date.getTime() === tempStartDate.getTime() ? 'ring-2 ring-green-600' : ''}
                      ${day.date && tempEndDate && day.date.getTime() === tempEndDate.getTime() ? 'ring-2 ring-green-600' : ''}
                      transition-all duration-200
                    `}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Footer with actions */}
            <div className="border-t p-4 flex justify-between">
              <button 
                onClick={clearDateRange}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Clear
              </button>
              
              <div>
                <button
                  onClick={cancelSelection}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={applyDateRange}
                  disabled={!tempStartDate || !tempEndDate}
                  className={`
                    px-4 py-2 text-sm rounded-md text-white transition-colors
                    ${(!tempStartDate || !tempEndDate) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                  `}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}