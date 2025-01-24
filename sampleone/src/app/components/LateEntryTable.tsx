import React from 'react';

const LateEntryTable = () => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className='bg-neutral-900'>
              <th>
                <div className="ml-8 text-white text-lg">Today's Late Entry</div>
              </th>
              <th>
                <div className="text-white text-lg">Time</div>
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
                    <div className="font-bold">Aarav Sharma</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-gray-500 text-lg font-bold">11:15 PM</div>
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
                    <div className="font-bold">Vivaan Nair</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-gray-500 text-lg font-bold">11:25 PM</div>
              </td>
            </tr>
            {/* row 3 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Reyansh Gupta</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-gray-500 text-lg font-bold">11:40 PM</div>
              </td>
            </tr>
            {/* row 4 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://i.pinimg.com/236x/ff/a5/69/ffa5691904cee410362563a2705ee0fd.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Arjun Verma</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-gray-500 text-lg font-bold">11:55 PM</div>
              </td>
            </tr>
            {/* row 5 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://i.pinimg.com/474x/78/7a/60/787a60c332c21cd729881357bca0803c.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Kabir Joshi</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-gray-500 text-lg font-bold">12:05 AM</div>
              </td>
            </tr>
            {/* row 6 */}
            <tr>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://i.pinimg.com/474x/39/24/06/392406701e1f956ad20f16b732d12c8c.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Advait Reddy</div>
                    <div className="text-sm opacity-50">S6 | CS</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-gray-500 text-lg font-bold">12:15 AM</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LateEntryTable;
