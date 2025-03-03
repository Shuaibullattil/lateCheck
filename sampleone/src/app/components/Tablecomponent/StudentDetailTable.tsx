"use client"
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import StudentDetailTableEntry from './StudentDetailTableEntry'

type Student = {
  id: string;
  hostel_id: string;
  name: string;
  branch: string;
  sem: string;
  hostel: string
  room_no: string;
  phone_no: string;
  email: string;
};

const StudentDetailTable = () => {

  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    axios.get<Student[]>('http://localhost:8000/students')
    .then(response => {
      setStudents(response.data)
    }).catch(error => {
      console.log(error)
    }
    );
  }, []);


  return (
    <div className='overflow-x-auto border shadow-xl'>
        <table className="table table-zebra">
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
            {students.map((student) => (
              <StudentDetailTableEntry key={student.id} student={student} />
            ))}
            </tbody>
        </table>
    </div>
  )
}

export default StudentDetailTable