"use client";
import { useRouter } from "next/navigation"; 
import Cookies from 'js-cookie'; 
import InventoryTable from "../../components/InventoryTable"
export default function InventoryPage() {
  const router = useRouter();
  const token = Cookies.get('access_token');
        if (!token) { 
          router.push('/');
          return;
        }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Inventory Records</h1>
      <InventoryTable />
    </div>
  );
}