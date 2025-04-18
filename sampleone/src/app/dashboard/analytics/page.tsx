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

// Mock student data
const students = [
  {
    id: 1,
    name: "Emma Wilson",
    grade: "10th Grade",
    lateCount: 3,
    avatar: "EW",
    reasons: ["Missed the bus", "Traffic", "Doctor's appointment"],
    attendance: 92,
    contactInfo: "emma.w@email.com | (555) 123-4567",
    notes: "Has permission slip for late arrival on Thursdays due to therapy."
  },
  {
    id: 2,
    name: "James Garcia",
    grade: "11th Grade",
    lateCount: 5,
    avatar: "JG",
    reasons: ["Overslept", "Missed the bus", "Traffic", "Family emergency", "Car trouble"],
    attendance: 88,
    contactInfo: "james.g@email.com | (555) 234-5678",
    notes: "Parents have been notified about frequent tardiness."
  },
  {
    id: 3,
    name: "Ava Johnson",
    grade: "9th Grade",
    lateCount: 1,
    avatar: "AJ",
    reasons: ["Traffic"],
    attendance: 98,
    contactInfo: "ava.j@email.com | (555) 345-6789",
    notes: "Excellent attendance record overall."
  },
  {
    id: 4,
    name: "Liam Chen",
    grade: "12th Grade",
    lateCount: 4,
    avatar: "LC",
    reasons: ["Car trouble", "Traffic", "Overslept", "Medical appointment"],
    attendance: 90,
    contactInfo: "liam.c@email.com | (555) 456-7890",
    notes: "Working on improving punctuality for college preparation."
  },
  {
    id: 5,
    name: "Sophia Patel",
    grade: "10th Grade",
    lateCount: 2,
    avatar: "SP",
    reasons: ["Traffic", "Family emergency"],
    attendance: 95,
    contactInfo: "sophia.p@email.com | (555) 567-8901",
    notes: "Recent family situation has affected attendance."
  }
];

const sidebarItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Student Details", icon: Users, href: "/studentdetail" },
    { name: "Requests", icon: FileText, href: "/dashboard/student-request" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Messages", icon: MessageSquare, href: "/dashboard/student-messages" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Logout", icon: LogOut, href: "/logout" },
  ];

// Modal Component
const ProfileModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mr-2">
              {student.avatar}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Grade:</span>
            <span className="font-medium">{student.grade}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Attendance:</span>
            <span className="font-medium">{student.attendance}%</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Late Count:</span>
            <span className="font-medium">{student.lateCount}</span>
          </div>
          
          <div>
            <span className="text-gray-600 block mb-1">Late Reasons:</span>
            <ul className="list-disc pl-5 text-sm">
              {student.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="text-gray-600 block mb-1">Contact:</span>
            <p className="text-sm">{student.contactInfo}</p>
          </div>
          
          <div>
            <span className="text-gray-600 block mb-1">Notes:</span>
            <p className="text-sm italic bg-gray-50 p-2 rounded">{student.notes}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
    
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
                    <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-3xl font-bold text-gray-700">{mockData.lateEntriesToday}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Most Common Reason:</p>
                    <p className="text-sm font-medium text-gray-800">{mockData.mostFrequentReason}</p>
                  </div>
                </div>

                {/* Student Profiles Component */}
                <div className="bg-white border border-green-300 shadow-md rounded-xl px-4 py-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2" /> 
                    Recent Late Students
                  </h3>
                  <div className="space-y-1">
                    {students.map((student) => (
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