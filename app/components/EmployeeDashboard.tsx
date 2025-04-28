'use client';

import { useState, useEffect } from 'react';
import api from "../../utils/api"

export default function EmployeeDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [clockStatus, setClockStatus] = useState('Clock In');

  useEffect(() => {
    const fetchData = async () => {
      const scheduleRes = await api.get('/employee/schedule/');
      const leaveRes = await api.get('/employee/leave/');
      setSchedules(scheduleRes.data);
      setLeaves(leaveRes.data);
    };
    fetchData();
  }, []);

  const handleClock = async () => {
    const action = clockStatus === 'Clock In' ? 'clock_in' : 'clock_out';
    const res = await api.post('/employee/clock-in-out/', { action, branch_id: 1 });
    setClockStatus(action === 'clock_in' ? 'Clock Out' : 'Clock In');
  };

  const requestLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      start_date: form.start_date.value,
      end_date: form.end_date.value,
      reason: form.reason.value,
    };
    const res = await api.post('/employee/leave/', data);
    setLeaves((prev) => [...prev, res.data]);
  };

  const requestSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      target: (form.elements.namedItem('target') as HTMLInputElement).value,
      schedule: form.schedule.value,
    };
    const res = await api.post('/employee/shift-swap/', data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Employee Dashboard</h1>
      <button onClick={handleClock} className="bg-blue-500 text-white p-2 rounded mb-4">
        {clockStatus}
      </button>
      <div className="mb-4">
        <h2 className="text-xl">My Schedule</h2>
        <ul>
          {schedules.map((schedule: any) => (
            <li key={schedule.id}>
              {schedule.start_time} - {schedule.end_time}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={requestLeave} className="mb-4">
        <input name="start_date" type="date" className="p-2 border rounded" />
        <input name="end_date" type="date" className="p-2 border rounded" />
        <textarea name="reason" placeholder="Reason" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Request Leave
        </button>
      </form>
      <form onSubmit={requestSwap}>
        <input
          name="target"
          placeholder="Target Employee ID"
          className="p-2 border rounded"
        />
        <input name="schedule" placeholder="Schedule ID" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Request Swap
        </button>
      </form>
    </div>
  );
}