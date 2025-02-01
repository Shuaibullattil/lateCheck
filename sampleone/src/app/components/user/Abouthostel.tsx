import React from 'react'

const Abouthostel = () => {
  return (
    <div className='grid grid-cols-6 border shadow-lg w-full rounded-md p-2'>
        <div className='col-span-6 prose'>
            <h1 className='text-gray-500'>Sahara Hostel</h1>
        </div>
        <div className='col-span-5 prose'>
            <p className='text-gray-400 tracking-normal leading-tight font-sans'>Near SOE,CUSAT,Kalamassery, Ernakulam,Kochi, Kerala - 682022</p>
        </div>
        <div className='col-span-6 grid grid-cols-6 pt-4 px-4'>
            <div className='flex col-span-1 justify-center items-center'>
                <img src="/openlock.svg" alt="open" className='h-6 w-6' />
            </div>
            <div className='col-span-2'>
                <h1 className='text-gray-500 font-sans'>06:00 AM</h1>
            </div>
            <div className='flex col-span-1 justify-center items-center'>
                <img src="/closelock.svg" alt="open" className='h-6 w-6' />
            </div>
            <div className='col-span-2'>
                <h1 className='text-gray-500 font-sans'>11:00 PM</h1>
            </div>
        </div>
    </div>
  )
}

export default Abouthostel