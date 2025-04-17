"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import SideBar from '../components/sidebar';
import Dashboardheader from '../components/dashboardheader';
import StudentDetailTable from '../components/Tablecomponent/StudentDetailTable';


export default function studendetail(){
        const [user, setUser] = useState<any>(null);
        const [isCheckingAuth, setIsCheckingAuth] = useState(true);
        
        const router = useRouter();
    
        // Auth check
            useEffect(() => {
            if (typeof window === "undefined") return;
        
            const storedUser = localStorage.getItem("warden");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.usertype !== "warden") {
                router.replace("/");
                } else {
                setUser(parsedUser);
                }
            } else {
                router.replace("/");
            }
        
            setIsCheckingAuth(false);
            }, [router]);
        

    return(
            <div>
                <div className='grid grid-cols-12 bg-slate-400' >
                    <div className=' prose items-center col-span-12'>
                        <Dashboardheader headername='Student Detail'/>
                    </div>
                </div>
                <div className='grid grid-cols-12 '>
                    <div className='md:col-span-3 lg:col-span-2 hidden md:block bg-base-300'>
                        <SideBar />
                    </div >
                    <div className='md:col-span-9 lg:col-span-10 col-span-12 bg-white ml-10 mt-4 p-8'>
                        <StudentDetailTable />
                    <div className='h-32'>
                        
                    </div>   
                </div>
            </div>
                
            </div>
    );
}