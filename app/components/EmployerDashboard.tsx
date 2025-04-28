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
      <form onSubmit={createSchedule} className="mb-4">
        <input name="employee" placeholder="Employee ID" className="p-2 border rounded" />
        <input name="branch" placeholder="Branch ID" className="p-2 border rounded" />
        <input name="start_time" type="datetime-local" className="p-2 border rounded" />
        <input name="end_time" type="datetime-local" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
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