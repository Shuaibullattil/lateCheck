"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, Users, BookOpen, Building, DoorClosed, 
  Phone, Mail, Filter, X, Check, RefreshCw, ChevronDown, ChevronUp, ArrowDownUp, GraduationCap
} from "lucide-react";

type Student = {
  id: string;
  hostel_id: string;
  name: string;
  branch: string;
  sem: string;
  hostel: string;
  room_no: string;
  phone_no: string;
  email: string;
};

const StudentRequestTable = ({ hostel, status }: { hostel: string; status: string }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [responseMessage, setResponseMessage] = useState({ text: "", type: "" });

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [hostelIdFilter, setHostelIdFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [semFilter, setSemFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setLoading(true);
    axios
      .get<Student[]>("http://localhost:8000/studentstable", {
        params: { hostel: hostel, status: status },
      })
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [hostel, status]);

  const clearFilters = () => {
    setNameFilter("");
    setBranchFilter("");
    setHostelIdFilter("");
    setRoomFilter("");
    setSemFilter("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (nameFilter) count++;
    if (branchFilter) count++;
    if (hostelIdFilter) count++;
    if (roomFilter) count++;
    if (semFilter) count++;
    return count;
  };

  const handleAction = (studentId: string, action: "accept" | "reject") => {
    const student = students.find(std => std.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setActionType(action);
      setShowConfirmation(true);
    }
  };

  const confirmAction = () => {
    if (!selectedStudent || !actionType) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Remove the student from the list
      const updatedStudents = students.filter(std => std.id !== selectedStudent.id);
      setStudents(updatedStudents);
      
      // Show success message
      setResponseMessage({
        text: `Student ${actionType === "accept" ? "approved" : "rejected"} successfully!`,
        type: actionType === "accept" ? "success" : "error"
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setResponseMessage({ text: "", type: "" }), 3000);
      
      setShowConfirmation(false);
      setSelectedStudent(null);
      setActionType(null);
      setLoading(false);
    }, 600);
    
    // For real implementation
    /*
    axios.post(`http://localhost:8000/studentstable/${selectedStudent.id}/${actionType}`)
      .then(() => {
        const updatedStudents = students.filter(std => std.id !== selectedStudent.id);
        setStudents(updatedStudents);
        setResponseMessage({
          text: `Student ${actionType === "accept" ? "approved" : "rejected"} successfully!`,
          type: actionType === "accept" ? "success" : "error"
        });
        setTimeout(() => setResponseMessage({ text: "", type: "" }), 3000);
        setShowConfirmation(false);
        setSelectedStudent(null);
        setActionType(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setResponseMessage({
          text: "An error occurred. Please try again.",
          type: "error"
        });
        setTimeout(() => setResponseMessage({ text: "", type: "" }), 3000);
        setLoading(false);
      });
    */
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Apply filters and sorting
  const filteredStudents = students.filter((student) =>
    String(student.name).toLowerCase().includes(nameFilter.toLowerCase()) &&
    (branchFilter === "" || student.branch === branchFilter) &&
    String(student.hostel_id).toLowerCase().includes(hostelIdFilter.toLowerCase()) &&
    String(student.room_no).toLowerCase().includes(roomFilter.toLowerCase()) &&
    (semFilter === "" || student.sem === semFilter)
  ).sort((a, b) => {
    const aValue = a[sortBy as keyof Student];
    const bValue = b[sortBy as keyof Student];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-3xl border border-green-300 shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-2 border-b border-green-100">
        <Users className="text-green-600 h-5 w-5" />
        <h2 className="text-base font-semibold text-green-800">
          Student Requests
        </h2>
        <div className="ml-auto flex gap-2">
          <button
            onClick={refreshData}
            className="flex items-center p-1.5 rounded-lg border border-green-200 hover:bg-green-50"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-green-600" : "text-green-600"} />
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg border ${
              activeFiltersCount > 0 
                ? "bg-green-50 border-green-300 text-green-700" 
                : "border-green-200 hover:bg-green-50"
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-2 border-b border-green-100 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pl-8 pr-2 py-1.5 text-sm w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-2 top-2 h-4 w-4 text-green-500" />
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-2 bg-[#f1fdf3] border-b border-green-100">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium text-green-800">Advanced Filters</h3>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> Branch
              </label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="border border-green-200 p-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Branches</option>
                <option value="CS">CS</option>
                <option value="IT">IT</option>
                <option value="EC">EC</option>
                <option value="EE">EE</option>
                <option value="CE">CE</option>
                <option value="SF">SF</option>
                <option value="ME">ME</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <Building className="h-3 w-3" /> Hostel ID
              </label>
              <input
                type="text"
                placeholder="Enter hostel ID"
                value={hostelIdFilter}
                onChange={(e) => setHostelIdFilter(e.target.value)}
                className="border border-green-200 p-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <DoorClosed className="h-3 w-3" /> Room No
              </label>
              <input
                type="text"
                placeholder="Enter room number"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="border border-green-200 p-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> Semester
              </label>
              <select
                value={semFilter}
                onChange={(e) => setSemFilter(e.target.value)}
                className="border border-green-200 p-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Semesters</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <ArrowDownUp className="h-3 w-3" /> Sort By
              </label>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction as "asc" | "desc");
                }}
                className="border border-green-200 p-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="hostel_id-asc">Hostel ID (Asc)</option>
                <option value="hostel_id-desc">Hostel ID (Desc)</option>
                <option value="sem-asc">Semester (Low to High)</option>
                <option value="sem-desc">Semester (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Status message */}
      {responseMessage.text && (
        <div 
          className={`p-2 border-b border-green-100 ${
            responseMessage.type === "success" ? "bg-[#ebf9f0] text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center px-2 py-1 text-sm">
            {responseMessage.type === "success" ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            {responseMessage.text}
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="h-[390px] overflow-y-auto p-2 relative">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-[#f1fdf3] border border-green-100 rounded-lg p-2">
                <div className="flex gap-2">
                  <div className="h-5 bg-green-100 rounded w-16"></div>
                  <div className="h-5 bg-green-100 rounded w-32"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-3 bg-green-100 rounded w-10"></div>
                  <div className="h-3 bg-green-100 rounded w-8"></div>
                  <div className="h-3 bg-green-100 rounded w-14"></div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <div className="h-6 bg-green-100 rounded w-16"></div>
                  <div className="h-6 bg-green-100 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm">No student requests found</p>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-green-600 text-xs mt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="h-full">
            {/* Mobile Cards View */}
            <div className="sm:hidden h-full overflow-y-auto">
              <div className="space-y-2 pb-1">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-[#f1fdf3] border border-green-300 rounded-lg p-2 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-green-800">{student.name}</h3>
                        <p className="text-xs text-gray-500">{student.hostel_id}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded flex items-center">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Sem {student.sem}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <Building className="h-3 w-3 mr-1" />
                        <span>{student.hostel}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <DoorClosed className="h-3 w-3 mr-1" />
                        <span>Room {student.room_no}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <BookOpen className="h-3 w-3 mr-1" />
                        <span>{student.branch}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{student.phone_no}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-600 mt-1 mb-2">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>{student.email}</span>
                    </div>
                    
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => handleAction(student.id, "reject")}
                        className="px-2 py-1 bg-white border border-red-500 text-red-600 rounded text-xs hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(student.id, "accept")}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block h-full overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-50 text-green-800 border-b border-green-200">
                    <th className="px-3 py-2 text-left text-xs font-medium">Hostel ID</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">
                      <div className="flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                        Name
                        {sortBy === "name" && (
                          sortDirection === "asc" ? 
                            <ChevronUp className="h-3 w-3 ml-1" /> : 
                            <ChevronDown className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Branch</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Sem</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Room</th>
                    <th className="px-3 py-2 text-center text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-[#f1fdf3] border-b border-green-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-green-50/30"
                      }`}
                    >
                      <td className="px-3 py-1.5 text-xs">{student.hostel_id}</td>
                      <td className="px-3 py-1.5 text-sm font-medium text-green-800">{student.name}</td>
                      <td className="px-3 py-1.5 text-xs">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                          {student.branch}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-xs">{student.sem}</td>
                      <td className="px-3 py-1.5 text-xs">
                        <div className="flex items-center">
                          <DoorClosed className="h-3 w-3 mx-1 text-green-600" />
                          {student.room_no}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleAction(student.id, "reject")}
                            className="px-2 py-1 bg-white border border-red-500 text-red-600 rounded text-xs hover:bg-red-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(student.id, "accept")}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirmation && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full mx-4 border border-green-300">
            <h3 className="text-lg font-medium text-green-800 mb-3">
              {actionType === "accept" ? "Approve Student Request?" : "Reject Student Request?"}
            </h3>
            <div className="bg-[#f1fdf3] p-3 rounded-lg mb-3 border border-green-100">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-800">Student: </span>
                  <span className="text-gray-700">{selectedStudent.name}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">ID: </span>
                  <span className="text-gray-700">{selectedStudent.hostel_id}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Branch: </span>
                  <span className="text-gray-700">{selectedStudent.branch}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Semester: </span>
                  <span className="text-gray-700">{selectedStudent.sem}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Room: </span>
                  <span className="text-gray-700">{selectedStudent.room_no}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Hostel: </span>
                  <span className="text-gray-700">{selectedStudent.hostel}</span>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-medium text-green-800">Contact: </span>
                <span className="text-gray-700">{selectedStudent.phone_no}</span>
              </div>
              <div className="mt-1 text-sm">
                <span className="font-medium text-green-800">Email: </span>
                <span className="text-gray-700">{selectedStudent.email}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-1.5 rounded text-white text-sm ${
                  actionType === "accept"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionType === "accept" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequestTable;