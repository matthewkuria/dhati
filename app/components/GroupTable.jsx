/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import { getGroups, deleteGroup } from '../../utils/api';
import ScaleLoader from "react-spinners/ScaleLoader";
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import EditEventsDialog from "./EditEventsDialog"

export default function GroupTable() {
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the events from the API
  const fetchGroups = async() => {
    try {
      const data = await getGroups(); // Call the events API endpoint
      setGroups(data); // Populate the events state
      setLoading(false);
    } catch (error) {
      setErrorMessage('Failed to load groups.');
      setLoading(false);
    }
  };
  useEffect(() => {             
        fetchGroups();
    }, []);
  const handleUpdate = () => {
    fetchGroups();
  }
// Delete an event
  const handleDelete = async (id) => {
    const d_status = confirm("Do you want to delete this Group?")
    if (d_status) {
      try {
      await deleteGroup(id);
      setGroups(events.filter((group) => group.id !== id)); 
    } catch (error) {
      setErrorMessage('ooops...Failed to delete an group');
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
  if (errorMessage) {
    return (
      <div className="error">{errorMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto text-xs">
      <Link href="groups/add-group" className="bg-blue-500 text-white px-4 py-2 mb-4 inline-block">
        Add a group
      </Link>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name/Title
            </th>
           
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coordinated by:
            </th>
            
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {groups.map((group) => (
            <tr key={group.id}>
                <td className="px-6 py- whitespace-nowrap">{group.name}</td>
                <td className="px-6 py-2 max-h-2 max-w-52 ">{group.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{group.coordinated_by}</td>
               <td className="px-6 py-2 whitespace-nowrap">
                {/* Button to delete event */}
                <button onClick={() => handleDelete(group.id)} className="text-red-500 hover:text-red-700">
                 <TrashIcon className='size-5 text-red-600 hover:size-4'/>
                </button>
                <EditEventsDialog event={group}  eventId={group.id} onUpdate={handleUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
