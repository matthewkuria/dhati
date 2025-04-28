'use client';

import { useState, useEffect } from 'react';
import api from "../../utils/api"
export default function EmployerDashboard() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [coverage, setCoverage] = useState(0);
  const [payroll, setPayroll] = useState([]);
  const [overtime, setOvertime] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const scheduleRes = await api.get('/employer/schedule/');
      const coverageRes = await api.get('/employer/coverage/');
      const payrollRes = await api.get('/employer/payroll/');
      const overtimeRes = await api.get('/employer/overtime/');
      setSchedules(scheduleRes.data);
      setCoverage(coverageRes.data.coverage);
      console.log(coverageRes.data.coverage);
      setPayroll(payrollRes.data);
      setOvertime(overtimeRes.data.overtime_employees);
    };
    fetchData();
  }, []);

  const createSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      employee: form.employee.value,
      branch: form.branch.value,
      start_time: form.start_time.value,
      end_time: form.end_time.value,
    };
    const res = await api.post('/employer/schedule/', data);
    setSchedules((prev) => [...prev, res.data]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Employer Dashboard</h1>
      <form onSubmit={createSchedule} className="mb-4 p-4 bg-gray-100 rounded shadow-md space-y-4">
        <div className="flex flex-col">
          <label htmlFor="employee" className="mb-1 font-medium">Employee ID</label>
          <input
        id="employee"
        name="employee"
        placeholder="Enter Employee ID"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="branch" className="mb-1 font-medium">Branch ID</label>
          <input
        id="branch"
        name="branch"
        placeholder="Enter Branch ID"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="start_time" className="mb-1 font-medium">Start Time</label>
          <input
        id="start_time"
        name="start_time"
        type="datetime-local"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end_time" className="mb-1 font-medium">End Time</label>
          <input
        id="end_time"
        name="end_time"
        type="datetime-local"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Schedule
        </button>
      </form>
      <div className="mb-4">
        <h2 className="text-xl">Staff Coverage</h2>
        <p>{coverage}%</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl">Payroll Preview</h2>
        <ul>
          {payroll.map((item: any) => (
            <li key={item.id}>
              {item.employee} - ${item.total_pay}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl">Overtime Alerts</h2>
        <ul>
          {overtime.map((emp: any) => (
            <li key={emp.employee}>
              Employee {emp.employee} - {emp.total_hours} hours
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}