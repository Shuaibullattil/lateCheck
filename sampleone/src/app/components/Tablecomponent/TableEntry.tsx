import React from 'react';

type Student = {
  id: number;
  name: string;
  batch: string;
  time: string;
  avatar?: string;
  student: string; // Optional field
};

const TableEntry = ({ student }: { student: Student }) => {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img
                src={student.avatar || "https://img.daisyui.com/images/profile/demo/2@94.webp"} // Use dynamic avatar or a fallback
                alt={`${student.name}'s Avatar`}
              />
            </div>
          </div>
          <div>
            <div className="font-bold">{student.name}</div> {/* Dynamic name */}
            <div className="text-sm opacity-50">{student.batch}</div> {/* Dynamic batch */}
          </div>
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip={student.reason}>
              <button className=""><img className="w-12 h-12"
                  src="message-bubble.svg" /></button>
            </div>
            </td>
      <td>
        <div className="text-gray-500 text-lg font-bold">{student.time}</div> {/* Dynamic time */}
      </td>
    </tr>
  );
};

export default TableEntry;
