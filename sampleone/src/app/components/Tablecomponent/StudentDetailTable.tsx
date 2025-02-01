import React from 'react'
import StudentDetailTableEntry from './StudentDetailTableEntry'
import students from '../../components/data/hostelstudents.json'

const StudentDetailTable = () => {
  return (
    <div className='overflow-x-auto border shadow-xl'>
        <table className="table table-zebra">
            <thead>
            <tr className="bg-blue-950 text-white">
                <th className="px-4 py-2">Hostel ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 hidden sm:table-cell">Branch</th>
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