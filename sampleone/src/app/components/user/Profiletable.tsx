import React from 'react'

const Profiletable = ({student} : {student:any}) => {
  return (
    <div className='grid grid-cols-4'>
        <div className='col-span-4'>
        <div className="overflow-x-auto w-80">
            <table className="table border">
                <tbody>
                {/* row 1 */}
                <tr>
                    <td className='font-bold '>Hostel</td>
                    <td className='font-bold text-gray-500'>{student?.details?.hostel}</td>
                </tr>
                <tr>
                    <td className='font-bold '>Room no</td>
                    <td className='font-bold text-gray-500'>{student?.details?.room_no}</td>
                </tr>
                <tr>
                    <td className='font-bold '>Branch</td>
                    <td className='font-bold text-gray-500'>{student?.details?.branch}</td>
                </tr>
                {/* row 2 */}
                <tr>
                    <td className='font-bold '>sem</td>
                    <td className='font-bold text-gray-500'>{student?.details?.sem}</td>
                </tr>
                {/* row 3 */}
                <tr>
                    <td className='font-bold '>Phone</td>
                    <td className='font-bold text-gray-500'>{student?.details?.phone_no}</td>
                </tr>
                <tr>
                    <td className='font-bold '>Email</td>
                    <td className='font-bold text-gray-500'>{student?.details?.email}</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
  )
}

export default Profiletable