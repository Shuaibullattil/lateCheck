import React from 'react'
import StudentDetailTableEntry from './StudentDetailTableEntry'
import students from '../../components/data/hostelstudents.json'

const StudentDetailTable = () => {
  return (
    <div>
        <table className="table w-full table-zebra">
            <thead>
            <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2">Hostel ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Branch</th>
                <th className="px-4 py-2">Sem</th>
                <th className="px-4 py-2">Room No</th>
                <th className="px-4 py-2">Phone no</th>
                <th className="px-4 py-2">Email</th>
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