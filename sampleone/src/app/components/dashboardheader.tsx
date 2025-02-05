import React from 'react'

const Dashboardheader = ({headername}: {headername:string}) => {
  return (
    <div>
        <div className='grid grid-cols-12 bg-slate-400' >
                <div className=' prose items-center col-span-12 ml-8 mt-4 mb-4'>
                    <h1 className='m-0 text-white'>{headername}</h1>
                    <h5 className='m-0 text-white'>Monday | 01:00 PM</h5>
                </div>
        </div>
    </div>
  )
}

export default Dashboardheader