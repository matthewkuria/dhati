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
      employee: 1, // Assuming employee ID is 1 for simplicity
    };
    console.log(data);
    const res = await api.post('/employee/leave/', data);
    setLeaves((prev) => [...prev, res.data]);
    if (res) {
      alert('Leave request sent successfully!');
      form.reset(); // Clear the inputs after successful post 
    }
    else {
      alert('Failed to send leave request. Please try again.');
    }
    setLeaves((prev) => [...prev, res.data]);
  };

  const requestSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      requester: 1, // Assuming employee ID is 1 for simplicity
      target: (form.elements.namedItem('target') as HTMLInputElement).value,
      schedule: form.schedule.value,
    };
    console.log(data);
    const res = await api.post('/employee/shift-swap/', data);
    if (res) {
       alert('Swap request sent successfully!');
       form.reset(); // Clear the inputs after successful post
    }else {
      alert('Failed to send swap request. Please try again.');
    }
    setLeaves((prev) => [...prev, res.data]);
   
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4 font-bold">Employee Dashboard</h1>
      <button onClick={handleClock} className="bg-blue-500 text-white p-2 rounded mb-4">
        {clockStatus}
      </button>
      <div className="mb-4 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">My Schedule</h2>
        <ul className="space-y-2">
          {schedules.map((schedule: any) => (
        <li key={schedule.id} className="p-2 border rounded bg-white shadow-sm text-quaternary font-semibold">
          <span className="font-medium">{schedule.start_time}</span> - <span className="font-medium">{schedule.end_time}</span>
        </li>
          ))}
        </ul>
      </div>
      <form onSubmit={requestLeave} className="mb-4 space-y-4 bg-gray-100 p-4 rounded shadow">
        <div className="flex flex-col">
          <label htmlFor="start_date" className="mb-1 text-sm font-medium text-gray-700">
        Start Date
          </label>
          <input
        id="start_date"
        name="start_date"
        type="date"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-quaternary"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end_date" className="mb-1 text-sm font-medium text-gray-700">
        End Date
          </label>
          <input
        id="end_date"
        name="end_date"
        type="date"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-quaternary"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="reason" className="mb-1 text-sm font-medium text-gray-700">
        Reason
          </label>
          <textarea
        id="reason"
        name="reason"
        placeholder="Reason"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-quaternary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-quaternary transition"
        >
          Request Leave
        </button>
      </form>
      <form onSubmit={requestSwap} className="mb-4 space-y-4 bg-gray-100 p-4 rounded shadow">
        <div className="flex flex-col">
          <label htmlFor="target" className="mb-1 text-sm font-medium text-gray-700">
        Target Employee ID
          </label>
          <input
        id="target"
        name="target"
        placeholder="Target Employee ID"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-quaternary"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="schedule" className="mb-1 text-sm font-medium text-gray-700">
        Schedule ID
          </label>
          <input
        id="schedule"
        name="schedule"
        placeholder="Schedule ID"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-quaternary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-quaternary transition"
        >
          Request Swap
        </button>
      </form>
    </div>
  );
}