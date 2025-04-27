"use client";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AttendanceTable from "../../components/AttendanceTable"
export default function Page() {
    const router = useRouter();
  const token = Cookies.get('access_token');
        if (!token) { 
          router.push('/');
          return;
        }
    return (
        <main className="">
             <h1>Church  Attendance</h1>
             <AttendanceTable />
       </main>
    )
}