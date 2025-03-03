import React from 'react';

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

const StudentDetailTableEntry = ({ student }: { student: Student }) => {
  return (
    <tr className='text-left font-bold'>
        <td className='w-32'>{student.hostel_id}</td>
        <td>{student.name}</td>
        <td className='hidden sm:table-cell w-16'>{student.branch}</td>
        <td className='hidden sm:table-cell w-16'>{student.hostel}</td>
        <td className='hidden sm:table-cell w-16'>{student.sem}</td>
        <td className='hidden sm:table-cell w-16'>{student.room_no}</td>
        <td className='hidden sm:table-cell w-32'>{student.phone_no}</td>
        <td className='hidden sm:table-cell'>{student.email}</td>
    </tr>
  );
};

export default StudentDetailTableEntry;
