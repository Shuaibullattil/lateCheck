"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDetailTableEntry from "./StudentDetailTableEntry";

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

const StudentDetailTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:8000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Filter students based on searchQuery (search by Name, ID, Room No, Branch)
  const filteredStudents = students.filter((student) =>
    [student.name, student.branch, student.hostel_id, student.room_no, student.sem]
      .some(field => String(field).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="overflow-x-auto border shadow-xl p-4">
      {/* Search Input */}
      <div className="flex mb-4 justify-center">
      <h1 className="p-4 bg-blue-800 font-bold text-white rounded-lg mx-2">filter</h1>
        <input
          type="text"
          placeholder="Search by Name, branch, id, room no, sem"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full sm:w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Student Table */}
      <table className="table">
        <thead>
          <tr className="bg-blue-950 text-white">
            <th className="px-4 py-2">Hostel ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2 hidden sm:table-cell">Branch</th>
            <th className="px-4 py-2 hidden sm:table-cell">Hostel</th>
            <th className="px-4 py-2 hidden sm:table-cell">Sem</th>
            <th className="px-4 py-2 hidden sm:table-cell">Room no</th>
            <th className="px-4 py-2 hidden sm:table-cell">Phone no</th>
            <th className="px-4 py-2 hidden sm:table-cell">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentDetailTableEntry key={student.id} student={student} />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetailTable;
