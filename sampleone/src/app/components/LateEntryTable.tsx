import React from 'react';
import TableEntry from './Tablecomponent/TableEntry';
import students from '../components/data/students.json';
  // Adjusted path based on your folder structure


const LateEntryTable = () => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-neutral-900">
              <th>
                <div className="ml-8 text-white text-lg">Today's Late Entry</div>
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
