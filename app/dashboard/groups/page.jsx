"use client";
import GroupTable from "../../components/GroupTable"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
export default function Page() {
    const router = useRouter();
      const token = Cookies.get('access_token');
            if (!token) { 
              router.push('/');
              return;
            }
    return (
        <GroupTable />
    )
}