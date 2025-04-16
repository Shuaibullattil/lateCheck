"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableEntry from './Tablecomponent/TableEntry';

interface Student {
  id: number;
  name: string;
  batch: string;
  avatar: string;
  time: string;
  reason: string;
}

const LateEntryTable = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/students/today'); // Change to your backend URL
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-neutral-900">
              <th>
                <div className="ml-8 text-white text-lg">Today&apos;s Late Entry</div>
              </th>
              <th>
                <div className="text-white text-lg">Reason</div>
              </th>
              <th>
                <div className="text-white text-lg">Time</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the students and render a row for each */}
            {students.map((student) => (
              <TableEntry key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LateEntryTable;
