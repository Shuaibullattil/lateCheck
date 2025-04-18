"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Users, GraduationCap, Building, Book, DoorClosed, Phone, Mail, Filter, X, Trash2 } from "lucide-react";

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

const StudentDetailTable = ({hostel, status}: {hostel: string, status: string}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [hostelIdFilter, setHostelIdFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [semFilter, setSemFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredStudents = students.filter((student) =>
    String(student.name).toLowerCase().includes(nameFilter.toLowerCase()) &&
    (branchFilter === "" || student.branch === branchFilter) &&
    String(student.hostel_id).toLowerCase().includes(hostelIdFilter.toLowerCase()) &&
    String(student.room_no).toLowerCase().includes(roomFilter.toLowerCase()) &&
    (semFilter === "" || student.sem.toString() === semFilter)
  );

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

  // Function to handle student deletion
  const handleDeleteStudent = (id: string) => {
    // In a real application, you would make an API call here
    // axios.delete(`http://localhost:8000/students/${id}`)
    //   .then(() => {
    //     // Remove from local state after successful deletion
    //     setStudents(students.filter(student => student.id !== id));
    //   })
    //   .catch(error => console.error("Error deleting student:", error));
    
    // For now, just remove from local state
    setStudents(students.filter(student => student.id !== id));
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-3xl border border-green-300 shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-2 border-b border-green-100">
        <Users className="text-green-600 h-5 w-5" />
        <h2 className="text-base font-semibold text-green-800">
          Student Directory
        </h2>
        <div className="ml-auto flex gap-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> Branch
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
                <Book className="h-3 w-3" /> Semester
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
          </div>
        </div>
      )}

      {/* Main content container - This is where we'll fix the scrolling */}
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
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm">No students found</p>
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
            {/* Mobile Cards View - Fixed to be properly scrollable */}
            <div className="sm:hidden h-full overflow-y-auto">
              <div className="space-y-2 pb-1">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-[#f1fdf3] border border-green-300 rounded-lg p-2 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-green-800">{student.name}</h3>
                        <p className="text-xs text-gray-500">{student.hostel_id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          {student.branch}
                        </span>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-500 hover:text-red-700 p-0.5 hover:bg-red-100 rounded-full"
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
                        <Book className="h-3 w-3 mr-1" />
                        <span>Sem {student.sem}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{student.phone_no}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-600">
                      <Mail className="h-3 w-3 mr-1" />
                      <span className="truncate">{student.email}</span>
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
                    <th className="px-3 py-2 text-left text-xs font-medium">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Branch</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Hostel</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Sem</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Room</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Phone</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Email</th>
                    <th className="px-3 py-2 text-center text-xs font-medium">Action</th>
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
                      <td className="px-3 py-1.5 text-xs">{student.hostel}</td>
                      <td className="px-3 py-1.5 text-xs">{student.sem}</td>
                      <td className="px-3 py-1.5 text-xs">{student.room_no}</td>
                      <td className="px-3 py-1.5 text-xs">{student.phone_no}</td>
                      <td className="px-3 py-1.5 text-xs truncate max-w-xs">{student.email}</td>
                      <td className="px-3 py-1.5 text-center">
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-500 hover:text-red-700 p-0.5 hover:bg-red-100 rounded-full"
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailTable;