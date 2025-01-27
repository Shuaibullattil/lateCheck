import React from 'react';
import SideBar from '../components/sidebar';
import Dashboardheader from '../components/dashboardheader';
import StudentDetailTable from '../components/Tablecomponent/StudentDetailTable';

export default function studendetail(){
    return(
            <div>
                <div className='grid grid-cols-12 bg-slate-400' >
                    <div className=' prose items-center col-span-12  mt-4 mb-4'>
                        <Dashboardheader headername='Student Detail'/>
                    </div>
                </div>
                <div className='grid grid-cols-12 '>
                    <div className='sm:col-span-2 hidden md:block bg-base-300'>
                        <SideBar />
                    </div >
                    <div className='sm:col-span-10 col-span-12 bg-white ml-10 mt-4 p-8'>
                        <StudentDetailTable />
                    <div className='h-32'>
                        
                    </div>   
                </div>
            </div>
                
            </div>
    );
}