"use client";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import MemberTable from '../../components/MemberTable';

export default function MembersPage() {
  const router = useRouter();
  const token = Cookies.get('access_token');
        if (!token) { 
          router.push('/');
          return;
        }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Church Members</h1>
      <MemberTable />
    </div>
  );
}
