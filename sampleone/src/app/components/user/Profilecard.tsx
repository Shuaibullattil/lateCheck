import React from 'react'

const Profilecard = ({student}:{student:any}) => {
  return (
    <div className='grid grid-cols-6 border my-2 px-2 rounded-md shadow-md bg-green-900'>
        <div className="flex avatar col-span-2 justify-center items-center py-8">
            <div className="mask rounded-full w-24">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
        </div>
        <div className='grid grid-cols-2 col-span-4 py-8'>
            <h1 className='flex col-span-2 px-4 font-extrabold text-2xl justify-start items-end text-white'>{student?.name}</h1>
            <h1 className='flex col-span-2 px-4 justify-start items-start text-lg font-medium text-gray-300
            '>ID {student?.details?.hostel_id}</h1>
        </div>
    </div>
  )
}

export default Profilecard