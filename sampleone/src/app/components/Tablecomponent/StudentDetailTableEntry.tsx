import React from 'react'

type Student = {
    id: number;
    hostel_id: string;  // Hostel ID in the format "22021774"
    name: string;
    branch: string;
    sem: string;
    room_no: string;
    phone_no: string;
    email: string;
  };

const StudentDetailTableEntry = ({student}:{student:Student}) => {
  return (
    <>
        <tr className='text-left font-bold'>
                <td>{student.hostel_id}</td>
                <td>{student.name}</td>
                <td>{student.branch}</td>
                <td>{student.sem}</td>
                <td>{student.room_no}</td>
                <td>{student.phone_no}</td>
                <td>{student.email}</td>
        </tr>
    </>
  )
}

export default StudentDetailTableEntry