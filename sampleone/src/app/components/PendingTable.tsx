import React from 'react'

const PendingTable = () => {
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
                <div><img className="w-12 h-12"
                        src="https://imgs.search.brave.com/OqS44ol5szQnorKC9mW0vdMjsPlTdS_h3VxRcVztwRw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8xNC85Mi9j/aGF0LWJ1YmJsZS1t/ZXNzYWdlLWljb24t/dmVjdG9yLTIyNjkx/NDkyLmpwZw" />
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
              <td>
                <div><img className="w-12 h-12"
                        src="https://imgs.search.brave.com/OqS44ol5szQnorKC9mW0vdMjsPlTdS_h3VxRcVztwRw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8xNC85Mi9j/aGF0LWJ1YmJsZS1t/ZXNzYWdlLWljb24t/dmVjdG9yLTIyNjkx/NDkyLmpwZw" />
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
                        src="https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg"
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
                <div><img className="w-12 h-12"
                        src="https://imgs.search.brave.com/OqS44ol5szQnorKC9mW0vdMjsPlTdS_h3VxRcVztwRw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8xNC85Mi9j/aGF0LWJ1YmJsZS1t/ZXNzYWdlLWljb24t/dmVjdG9yLTIyNjkx/NDkyLmpwZw" />
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