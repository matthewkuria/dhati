/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import {  deleteMember } from '../../utils/api';
import Cookies from 'js-cookie';
import ScaleLoader from "react-spinners/ScaleLoader";
import Link from 'next/link';
import EditMemberDialog from "./EditMemberDialog"
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/solid';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import * as XLSX from 'xlsx';

export default function MemberTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [members, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  // State to hold filter values 
  const [filters, setFilters] = useState({
    gender: "", // Default filter for gender
    membership: "",
    marital_status: "",
    search: "",
  });

   const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);  
  const fetchMembers = async (page = 1) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setAllMembers(data.results); 
    setTotalPages(Math.ceil(data.count / 7)); // Assuming `count` contains the total number of members
    setLoading(false)
    console.log(members)
  } catch (err) {
    console.error('Error fetching members:', err);
  }
  };

useEffect(() => {
  fetchMembers(currentPage);
}, [currentPage]);
  
const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
    fetchMembers(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
    fetchMembers(currentPage - 1);
  }
};

  
 // Update a member
  const handleUpdate = () => {
    fetchMembers();   
  };
// Handle refresh table
  const handleRefresh = () => {
  setFilters ({
    gender: "", 
    membership: "",
    marital_status: "",
    search: "",
    })
    setSelectedMembers([]);
    setEditingMemberId(null);
}
  // Mass deletion
  const handleMassDelete = async () => {
    if (selectedMembers.length === 0) {
      alert("No members selected for deletion.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete the selected members?");
    if (confirmed) {
      try {
        await Promise.all(
          selectedMembers.map(async (memberId) => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}/`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          })
        );

        alert("Selected members deleted successfully.");
        onUpdate(); // Refresh the member list
        setSelectedMembers([]); // Clear selection
      } catch (error) {
        console.error("Error deleting members:", error);
        alert("Failed to delete selected members. Please try again.");
      }
    }
  }; 
  
// Delete a member
  const handleDelete = async (id) => {
  const confirmed = confirm("Are you sure you want to delete?");
  if (!confirmed) return;

  try {
    const response = await deleteMember(id);

    if (!response.ok) {
      if (response.status === 404) {
        setErrorMessage('The member does not exist or has already been deleted.');
      } else {
        setErrorMessage('An error occurred while deleting the member. Please try again.');
      }
      return;
    }

    setAllMembers((prev) => prev.filter((member) => member.id !== id));
    setErrorMessage(null); // Clear error message if successful
  } catch (err) {
    console.error('Error deleting member:', err);
    setErrorMessage('Failed to delete the member. Please check your network connection and try again.');
  }
};

  
  
 // Handle checkbox change
  const handleCheckboxChange = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId)); // Unselect member
    } else {
      setSelectedMembers([...selectedMembers, memberId]); // Select member
    }
  };
 // Apply filters to the members list
  const filteredMembers = members.filter(member => {
    let isMatch = true;

    // Gender filter
    if (filters.gender && member.gender !== filters.gender) {
      isMatch = false;
    }

    // Membership status filter
    if (filters.membership && member.membership !== filters.membership) {
      isMatch = false;
    }
    // Marital status
    if (filters.marital_status && member.marital_status !== filters.marital_status) {
      isMatch = false;
    }
    // Search filter (checks if the search query matches any part of the full name)
    if (filters.search && !member.full_name.toLowerCase().includes(filters.search.toLowerCase())) {
      isMatch = false;
    }

    return isMatch;
  });

  // Prepare data for download
 const downloadSelectedMembersExcel = () => {
  const selectedFilteredMembers = filteredMembers.filter(member =>
    selectedMembers.includes(member.id)
  );

  const data = selectedFilteredMembers.map(member => [
    member.full_name,
    member.member_number,
    member.membership,
    member.baptism_status,
    member.baptism_date,
    member.marital_status,
    member.dob,
    member.gender,
    member.mobile,
    member.residence,
    member.postal_address,
    member.date_left,
  ]);

  const ws = XLSX.utils.aoa_to_sheet([
    ["Full Name", "Member Number","Membership","Baptism Status", "Baptism Date", "Marital Status", "Date of Birth", "Gender", "Mobile", "Residence", "Postal Address", "Date Left"],
    ...data
  ]);

  // Adjust the column widths (with the fixed function)
  setColumnWidths(ws, data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SelectedMembers');
  XLSX.writeFile(wb, 'selected_members.xlsx');
};

// Function to adjust column widths based on content
const setColumnWidths = (ws, data) => {
  if (!data || data.length === 0) {
    return;
  }

  const colWidths = data.map(row => row.map(val => ({ wch: val ? val.toString().length + 2 : 10 })));
  const maxColWidths = colWidths[0].map((_, colIndex) => Math.max(...colWidths.map(row => row[colIndex].wch)));
  ws['!cols'] = maxColWidths.map(wch => ({ wch }));
};

  // If loading, show a loader
  if (loading) {
    return <ScaleLoader
  color="#1a0af0"
  radius={10}
  speedMultiplier={5}
/>;
  }
  
  
  return (
    <div className="overflow-x-auto text-xs">
      <div className=' FILTERS flex flex-row justify-around'>
        {/* Search Functionality */}
      <input
        type="text"
        placeholder="Search members..."
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
      />
      {/* Filter functionality */}
      {/* Filter by Gender */}
        <select
          onChange={e => setFilters({ ...filters, gender: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
      </select>
      {/* Filter by Membership */}
        <select
          onChange={e => setFilters({ ...filters, membership: e.target.value }) }
          className="border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="">All Memberships</option>
          <option value="regular">Regular</option>
          <option value="associate">Associate</option>
          <option value="guest">Guest</option>
        </select>
        {/* Filter by Marital Status */}
        <select
          onChange={e => setFilters({ ...filters, marital_status: e.target.value }) }
          className="border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="">Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
        {/* Refresh Button */}
        <Button className='bg-white hover:bg-white shadow-none' onClick={handleRefresh}>
         <ArrowPathIcon className='size-4 text-slate-500 hover:size-5' />
        </Button> 
       {/* Add Member Button */}
      <Link href="members/add-member" className="bg-white text-white px-4 py-2 mb-4 inline-block">
        <UserPlusIcon className='size-6 text-blue-700 hover:size-5 ' />
      </Link>
       <Button onClick={handleMassDelete} className="bg-white shadow-none hover:bg-white ">
        <TrashIcon className="size-6 text-red-600 hover:size-5"/>
        </Button>
        <Button onClick={downloadSelectedMembersExcel} className='bg-white hover:bg-white'>
          <DownloadIcon className='size-6 text-blue-600 hover:size-5' />
        </Button>
        <p className='font-bold'>Total Records: <span className='text-xl'>{ members.length}</span></p>
        <p className='font-bold'>Records Found: <span className='text-xl'>{filteredMembers.length}</span></p>
        <p className='font-bold'>Selected:<span className=' text-xl text-blue-600'>{selectedMembers.length }</span></p>
      </div>
      <table className="min-w-full sm:min-w-lg divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>
              {/* Header checkbox for selecting/deselecting all */}
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    // Select all members
                    setSelectedMembers(filteredMembers.map(m => m.id));
                  } else {
                    // Deselect all members
                    setSelectedMembers([]);
                  }
                }}
                checked={selectedMembers.length === members.length && members.length > 0}
              />
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  ">
              Member No.
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Full Name
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Membership
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Baptism Status
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Date of Baptism
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Gender
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Marital Status
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              D.O.B
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Residence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Address
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Date Joined
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              Left at
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredMembers.map((member) => (
            <tr key={member.id} className={`hover:bg-gray-100 transition duration-200 ease-in-out ${editingMemberId === member.id ? "bg-yellow-100" : "bg-white"}`} onClick={()=>setEditingMemberId(member.id)}>
              <td>
                {/* Checkbox for each member */}
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => handleCheckboxChange(member.id)}
                />
              </td>
              <td className="px-1 py-2 whitespace-nowrap">{member.member_number}</td>
              <td className="px-4 py-2 whitespace-nowrap">{member.full_name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{member.membership}</td>
              <td className="px-4 py-2 whitespace-nowrap">{member.baptism_status}</td>
              <td className="px-4 py-2 whitespace-nowrap">{member.baptism_date}</td>
              <td className="px-1 py-2 whitespace-nowrap">{member.gender}</td>
              <td className="px-1 py-2 whitespace-nowrap">{member.marital_status}</td>
              <td className="px-1 py-2 whitespace-nowrap">{member.dob}</td>
              <td className="px-6 py-2 whitespace-nowrap">{member.mobile}</td>
              <td className="px-6 py-2 whitespace-nowrap">{member.residence}</td>
              <td className="px-6 py-2 whitespace-nowrap">{member.postal_address}</td>
              <td className="px-1 py-2 whitespace-nowrap">{member.date_joined}</td>
              <td className="px-1 py-2 whitespace-nowrap">{member.date_left}</td>
               <td className="px-6 py-2 whitespace-nowrap">
                {/* Button to delete member */}
                <button onClick={() => handleDelete(member.id)} className='mx-2'>
                 <TrashIcon className="size-4 text-red-600 "/>
                </button>
                          
                {/* Pass member data to the EditMemberDialog */}
                <EditMemberDialog member={member} memberId={member.id} onUpdate={handleUpdate}  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
    <div className="flex justify-between mt-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 rounded  hover:bg-blue-800 hover:text-white"
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-blue-800 hover:text-white"
      >
        Next
      </button>
    </div>
    </div>
  );
}
