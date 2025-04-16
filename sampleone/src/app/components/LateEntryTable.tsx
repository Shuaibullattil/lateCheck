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

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/students/today');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch initially

    const interval = setInterval(() => {
      fetchStudents(); // Fetch every 10 seconds
    }, 2000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
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
