import React from 'react'

const Profilecard = ({student}:{student:any}) => {
  return (
    <div className='grid grid-cols-6 border my-2 px-2 rounded-md shadow-md bg-green-900'>
        <div className="flex avatar col-span-2 justify-center items-center py-8">
            <div className="mask rounded-full w-24">
                <img src="https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg" />
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