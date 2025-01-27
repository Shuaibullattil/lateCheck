import React from 'react'
import TableEntry from './Tablecomponent/TableEntry';

const lateEntryResponses = [
  {
    reason: "I was delayed due to a project meeting that ran longer than expected. We were discussing some critical aspects, and I couldn’t leave until everything was sorted out. I apologize for the delay."
  },
  {
    reason: "I had to attend a sudden extra class arranged by the department to cover some missed lessons. It went longer than planned, and I lost track of time. I’ll ensure to manage my schedule better going forward."
  },
  {
    reason: "I missed the earlier bus and had to wait for the next one. Unfortunately, there was heavy traffic on the way back, which further delayed my arrival. I’ll plan my travels more carefully in the future."
  }
];




const PendingTable = () => {

  const Reason = lateEntryResponses;

  return (
    <div>
        <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className='bg-blue-950'>
              <th >
                <div className="ml-8 text-white text-lg ">Pending</div>
              </th>
              <th>
                <div className="text-white text-lg">Reason</div>
              </th>
              <th>
                <div className="flex justify-center text-white text-lg">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Ishaan</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                  <div className="tooltip" data-tip={Reason[0].reason}>
                    <button className=""><img className="w-12 h-12"
                        src="message-bubble.svg" /></button>
                  </div>
            </td>
              <td>
                <div className='flex gap-2'>
                    <div><a href="" className='p-2 rounded-md bg-green-600 text-white'>Accept</a></div>
                    <div><a href="" className='p-2 rounded-md bg-red-700 text-white'>Reject</a></div>
                </div>    
              </td>
            </tr>
            {/* row 2 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://i.pinimg.com/736x/c4/ea/8b/c4ea8bf28dd46e81339c825ff8248533.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Rohan</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td >
                  <div className="tooltip" data-tip={Reason[1].reason}>
                    <button className=""><img className="w-12 h-12"
                        src="message-bubble.svg" /></button>
                  </div>
            </td>
              <td>
                <div className='flex gap-2'>
                    <div><a href="" className='p-2 rounded-md bg-green-600 text-white'>Accept</a></div>
                    <div><a href="" className='p-2 rounded-md bg-red-700 text-white'>Reject</a></div>
                </div>
              </td>
            </tr>
            {/* row 3 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://i.pinimg.com/736x/c4/ea/8b/c4ea8bf28dd46e81339c825ff8248533.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Aryan</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div className="tooltip" data-tip={Reason[2].reason}>
                    <button className=""><img className="w-12 h-12"
                        src="message-bubble.svg" /></button>
                  </div>
                </div>
            </td>
              <td>
                <div className='flex gap-2'>
                    <div><a href="" className='p-2 rounded-md bg-green-600 text-white'>Accept</a></div>
                    <div><a href="" className='p-2 rounded-md bg-red-700 text-white'>Reject</a></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PendingTable