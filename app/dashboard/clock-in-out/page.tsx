"use client";
import React, { useEffect, useState } from 'react'
import api from '../../../utils/api'

const page = () => {
    const [clockIns, setClockIns] = useState<{ id: string; employee_id: string; clock_in: string; is_late?: boolean; approved?: boolean }[]>([]);
    console.log(clockIns);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');   
    
    const approveLate = async (clockId: string) => {
        await api.post('/admin/clock-ins/', { clock_id: clockId });
        setClockIns((prev) =>
          prev.map((item: any) =>
            item.id === clockId ? { ...item, approved: true } : item
          )
        );
  };
  useEffect(() => {
      const fetchData = async () => {
        const clockRes = await api.get(`/admin/clock-ins/?branch=${selectedBranch}`);
        const branchRes = await api.get('/admin/branches/');
        setClockIns(clockRes.data);
        setBranches(branchRes.data);
      };
      fetchData();})
  return (
      <div className="">
          <div>
        <h2 className="text-xl mb-2 uppercase font-bold text-quaternary">Clock-Ins/Outs</h2>
        <ul>
          {clockIns.map((clock: any) => (
            <li key={clock.id} className="mb-4 p-4 bg-gray-100 rounded shadow-md flex justify-between items-center">
              {clock.id} - {clock.clock_in}
              {!clock.is_late && !clock.approved && (
                <span className="text-red-500 font-bold">Late</span>
              )}
              {!clock.is_late && clock.approved && (
                <span className="text-green-500 font-bold">On Time</span>
              )}
              {!clock.is_late && !clock.approved && (
                <button
                  onClick={() => approveLate(clock.id)}
                  className="ml-4 bg-green-500 text-white p-1 rounded hover:bg-secondary transition-colors hover:text-quaternary"
                >
                  Approve Late
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default page