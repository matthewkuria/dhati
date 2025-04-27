"use client";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';  
import EventsTable from "../../components/EventsTable"
export default function EventsPage() {
  const router = useRouter();
  const token = Cookies.get('access_token');
        if (!token) { 
          router.push('/');
          return;
        }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Church Events</h1>
      <EventsTable />
    </div>
  );
}
