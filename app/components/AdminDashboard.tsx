'use client';

import { useState, useEffect } from 'react';
import api from "../../utils/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AdminDashboard() {
  const [clockIns, setClockIns] = useState<{ id: string; employee_id: string; clock_in: string; is_late?: boolean; approved?: boolean }[]>([]);
  console.log(clockIns);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const clockRes = await api.get(`/admin/clock-ins/?branch=${selectedBranch}`);
      const branchRes = await api.get('/admin/branches/');
      setClockIns(clockRes.data);
      setBranches(branchRes.data);
    };
    fetchData();

    // WebSocket for real-time clock-ins
    const ws = new WebSocket('ws://localhost:8000/ws/clock-in-out/');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setClockIns((prev) => [...prev, data]);
    };
    return () => ws.close();
  }, [selectedBranch]);

  const approveLate = async (clockId: string) => {
    await api.post('/admin/clock-ins/', { clock_id: clockId });
    setClockIns((prev) =>
      prev.map((item: any) =>
        item.id === clockId ? { ...item, approved: true } : item
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 font-bold">Admin Dashboard</h1>
      <select
        onChange={(e) => setSelectedBranch(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">All Branches</option>
        {branches.map((branch: any) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
      <LineChart width={600} height={300} data={clockIns}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="clock_in" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="employee_id" stroke="#8884d8" />
      </LineChart>
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
  );
}