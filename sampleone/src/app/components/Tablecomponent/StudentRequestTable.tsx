"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

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

const StudentRequestTable = ({hostel,status}:{hostel:string,status:string}) => {
  const [students, setStudents] = useState<Student[]>([]);

  const [nameFilter, setNameFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [hostelIdFilter, setHostelIdFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [semFilter, setSemFilter] = useState("");

  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:8000/studentstable",{
        params: { hostel: hostel, status:status },
      })
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredStudents = students.filter((student) =>
    String(student.name).toLowerCase().includes(nameFilter.toLowerCase()) &&
    (branchFilter === "" || student.branch === branchFilter) &&
    String(student.hostel_id).toLowerCase().includes(hostelIdFilter.toLowerCase()) &&
    String(student.room_no).toLowerCase().includes(roomFilter.toLowerCase()) &&
    (semFilter === "" || student.sem.toString() === semFilter)
  );

  return (
    <div className="overflow-x-auto border shadow-xl p-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border p-2 rounded-md"
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
        <input
          type="text"
          placeholder="Search Hostel ID"
          value={hostelIdFilter}
          onChange={(e) => setHostelIdFilter(e.target.value)}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Search Room No"
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select
          value={semFilter}
          onChange={(e) => setSemFilter(e.target.value)}
          className="border p-2 rounded-md"
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

      {/* Table */}
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
            <th className="px-4 py-2 hidden sm:table-cell">Verify</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr className='text-left font-normal hover:bg-green-200' key={student.id}>
                <td className='w-32'>{student.hostel_id}</td>
                <td>{student.name}</td>
                <td className='hidden sm:table-cell w-16'>{student.branch}</td>
                <td className='hidden sm:table-cell w-16'>{student.hostel}</td>
                <td className='hidden sm:table-cell w-16'>{student.sem}</td>
                <td className='hidden sm:table-cell w-16'>{student.room_no}</td>
                <td className='hidden sm:table-cell w-32'>{student.phone_no}</td>
                <td className='hidden sm:table-cell'>{student.email}</td>
                <td><button className="px-2 py-2 mx-2 bg-green-500 rounded-md hover:bg-green-300">Accept</button><button className="px-2 py-2 bg-red-500 rounded-md hover:bg-red-300">Reject</button></td>
              </tr>
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

export default StudentRequestTable;
