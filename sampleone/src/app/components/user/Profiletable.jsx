import React from 'react'

const Profiletable = () => {
  return (
    <div className='grid grid-cols-4'>
        <div className='col-span-4'>
        <div className="overflow-x-auto w-72">
            <table className="table border">
                <tbody>
                {/* row 1 */}
                <tr>
                    <td className='font-bold '>Hostel</td>
                    <td className='font-bold text-gray-500'>Sahara</td>
                </tr>
                <tr>
                    <td className='font-bold '>Room no</td>
                    <td className='font-bold text-gray-500'>103</td>
                </tr>
                <tr>
                    <td className='font-bold '>Branch</td>
                    <td className='font-bold text-gray-500'>Computer sceince</td>
                </tr>
                {/* row 2 */}
                <tr>
                    <td className='font-bold '>sem</td>
                    <td className='font-bold text-gray-500'>6</td>
                </tr>
                {/* row 3 */}
                <tr>
                    <td className='font-bold '>Phone</td>
                    <td className='font-bold text-gray-500'>9846574560</td>
                </tr>
                <tr>
                    <td className='font-bold '>Email</td>
                    <td className='font-bold text-gray-500'>sheethaljoshi@gmail.com</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
  )
}

export default Profiletable