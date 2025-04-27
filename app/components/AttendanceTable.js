'use client';
import React, { useEffect, useState } from 'react';
import { getAttendances,deleteAttendance } from '../../utils/api';
import ScaleLoader from "react-spinners/ScaleLoader";
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/solid';
import EditAttendanceDialog from "./EditAttendanceDialog"



export default function AttendanceTable() {
  const [attendances, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the events from the API
  const fetchAttendances = async () => {
    try {
      const data = await getAttendances(); // Call the events API endpoint
      setAttendance(data); // Populate the events state
      setLoading(false);
    } catch (error) {
      setError('Failed to load attendances.');
      setLoading(false);
    }
  };

  useEffect(() => {             
        fetchAttendances();
    }, []);
  // Update a attendance
   const handleUpdate = () => {
    fetchAttendances();   
  };
// Delete an attendance
  const handleDelete = async (id) => {
    const d_status = confirm("Do you want to delete this record?")
    if (d_status) {
      try {
      await deleteAttendance(id);
      setAttendance(attendances.filter((attendance) => attendance.id !== id)); 
    } catch (error) {
      setError('ooops...Failed to delete an attendance');
    }
    }
  };

  // If loading, show a loader
  if (loading) {
    return <ScaleLoader
  color="#1a0af0"
  radius={10}
  speedMultiplier={5}
/>;
  }

  // If there’s an error, show the error message
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto text-xs">
        <Link href="attendances/add-attendance" className="bg-blue-500 text-white px-4 py-2 mb-4 inline-block">
        Add an Attendance
      </Link>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Date
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
             attendances
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
             Present/Absent
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Actions
            </th>                      
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendances.map((attendance) => (
            <tr key={attendance.id}>
                <td className="px-6 py-2 whitespace-nowrap">{attendance.doa}</td>
                <td className="px-6 py-2 whitespace-nowrap">{attendance.total_present}</td>
                <td className="px-6 py-2 whitespace-nowrap">{attendance.present_status}</td>
               <td className="px-6 py-2 whitespace-nowrap">
                {/* Button to delete attendance */}
                <button onClick={() => handleDelete(attendance.id)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className='size-6 text-red-600'/>
                </button>
                {/* pass data to the edit dialog */}
                <EditAttendanceDialog attendance={attendance} attendanceId={attendance.id} onUpdate={handleUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
