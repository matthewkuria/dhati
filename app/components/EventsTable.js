/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import { getEvents,deleteEvent } from '../../utils/api';
import ScaleLoader from "react-spinners/ScaleLoader";
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import EditEventsDialog from "./EditEventsDialog"



export default function EventTable() {
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the events from the API
  const fetchEvents = async() => {
    try {
      const data = await getEvents(); // Call the events API endpoint
      setEvents(data); // Populate the events state
      setLoading(false);
    } catch (error) {
      setErrorMessage('Failed to load events.');
      setLoading(false);
    }
  };
  useEffect(() => {             
        fetchEvents();
    }, []);
  const handleUpdate = () => {
    fetchEvents();
  }
// Delete an event
  const handleDelete = async (id) => {
    const d_status = confirm("Do you want to delete this event?")
    if (d_status) {
      try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id)); 
    } catch (error) {
      setErrorMessage('ooops...Failed to delete an event');
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
      <Link href="events/add-event" className="bg-blue-500 text-white px-4 py-2 mb-4 inline-block">
        Add an Event
      </Link>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name/Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Venue
            </th> 
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coordinated by:
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department involved
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id}>
                <td className="px-6 py- whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-2 whitespace-nowrap">{event.doe}</td>
                <td className="px-6 py-2 max-h-2 max-w-52 ">{event.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.venue}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.coordinated_by}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.budget}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.dept}</td>
               <td className="px-6 py-2 whitespace-nowrap">
                {/* Button to delete event */}
                <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700">
                 <TrashIcon className='size-5 text-red-600 hover:size-4'/>
                </button>
                <EditEventsDialog event={event}  eventId={event.id} onUpdate={handleUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
