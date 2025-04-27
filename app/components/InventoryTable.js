/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import {  getInventory, deleteInventory } from '../../utils/api';
import ScaleLoader from "react-spinners/ScaleLoader";
import Link from 'next/link';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import EditInventoryDialog from "./EditInventoryDialog"

export default function InventoryTable() {
  const [items, setItems] = useState([]);
  const [selecteditems, setSelecteditems] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  // State to hold filter values 
  const [filters, setFilters] = useState({
    issued_to:"",
    current_condition:"",
    search: "",
  });

   const [loading, setLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState(null);  
  const fetchInventory = async () => {
     try {
        const data = await getInventory(); // Call the items API endpoint
        setItems(data); // Populate the items state
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to load inventory items.');
        setLoading(false);
      }
  };
  // Fetch the items from the API
  useEffect(() => {
    fetchInventory();
  }, []);
  
 // Update a member
  const handleUpdate = () => {
    fetchInventory();   
  };
// Handle refresh table
  const handleRefresh = () => {
  setFilters ({
      issued_to: "", 
    current_condition:"",
    search: "",
    })
    setSelecteditems([]);
    setEditingMemberId(null);
}
  // Mass deletion
  const handleMassDelete = async () => {
    if (selecteditems.length === 0) {
      alert("No items selected for deletion.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete the selected items?");
    if (confirmed) {
      try {
        await Promise.all(
          selecteditems.map(async (itemId) => {
            await fetch(`http://localhost:8000/api/inventory/${itemId}/`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                // Add other headers if needed, e.g., Authorization
              },
            });
          })
        );

        alert("Selected items deleted successfully.");
        onUpdate(); // Refresh the member list
        setSelecteditems([]); // Clear selection
      } catch (error) {
        console.error("Error deleting items:", error);
        alert("Failed to delete selected items. Please try again.");
      }
    }
  }; 
  
// Delete a member
  const handleDelete = async (id) => {
    const d_status = confirm("Are you sure you want to delete?")
    if (d_status) {
      try {      
      await deleteInventory(id);
      setItems(items.filter((item) => item.id !== id)); // Remove member from state
    } catch (error) {
      setErrorMessage('Failed to delete item.');
    }
    }
  }; 
  
  
 // Handle checkbox change
  const handleCheckboxChange = (memberId) => {
    if (selecteditems.includes(memberId)) {
      setSelecteditems(selecteditems.filter(id => id !== memberId)); // Unselect member
    } else {
      setSelecteditems([...selecteditems, memberId]); // Select member
    }
  };
 // Apply filters to the items list
  const filtereditems = items.filter(item => {
    let isMatch = true;

    // Issued to filter
    if (filters.issued_to && item.issued_to !== filters.issued_to) {
      isMatch = false;
    }

    // Current Condition filter
    if (filters.current_condition && item.current_condition !== filters.current_condition) {
      isMatch = false;
    }
    // Search filter (checks if the search query matches any part of the full name)
    if (filters.search && !item.item_name.toLowerCase().includes(filters.search.toLowerCase())) {
      isMatch = false;
    }

    return isMatch;
  });

  
  // If loading, show a loader
  if (loading) {
    return <ScaleLoader
  color="#1a0af0"
  radius={10}
  speedMultiplier={5}
/>
  }
  // If there’s an error, show the error message
  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }
  
  return (
    <div className="overflow-x-auto text-xs">
      <div className=' FILTERS flex flex-row justify-around'>
        {/* Search Functionality */}
      <input
        type="text"
        placeholder="Search items here"
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
      />
      {/* Filter functionality */}
      {/* Filter by Gender */}
        <select
          onChange={e => setFilters({ ...filters, issued_to: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="">All Custodians</option>
          <option value="church">Church</option>
          <option value="bible school">Bible School</option>
      </select>
      {/* Filter by itemship */}
        <select
          onChange={e => setFilters({ ...filters, current_condition: e.target.value }) }
          className="border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="">All conditions</option>
          <option value="good">Good</option>
          <option value="faulty">faulty</option>
          <option value="poor">Poor</option>
        </select>
        
        {/* Refresh Button */}
        <Button className='bg-white hover:bg-white shadow-none' onClick={handleRefresh}>
         <ArrowPathIcon className='size-4 text-slate-500 hover:size-5' />
        </Button> 
       {/* Add Inventory Button */}
      <Link href="inventory/add-item" className="bg-white text-white px-4 py-2 mb-4 inline-block">
        <PlusCircleIcon className='size-6 text-blue-700 hover:size-5 ' />
      </Link>
       <Button onClick={handleMassDelete} className="bg-white shadow-none hover:bg-white ">
        <TrashIcon className="size-6 text-red-600 hover:size-5"/>
        </Button>        
        <p className='font-bold'>Total Records: <span className='text-xl'>{ items.length}</span></p>
        <p className='font-bold'>Records Found: <span className='text-xl'>{filtereditems.length}</span></p>
        <p className='font-bold'>Selected:<span className=' text-xl text-blue-600'>{selecteditems.length }</span></p>
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
                    // Select all items
                    setSelecteditems(filtereditems.map(m => m.id));
                  } else {
                    // Deselect all items
                    setSelecteditems([]);
                  }
                }}
                checked={selecteditems.length === items.length && items.length > 0}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  ">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  ">
             Serial Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  ">
             Item Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  ">
              Issue to
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  ">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500  ">
              Date Bought/Received
            </th>
            <th className="px-1 py-3 text-left text-xs font-medium text-gray-500  ">
              Current Condition
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filtereditems.map((item) => (
            <tr key={item.id} className={`hover:bg-gray-100 transition duration-200 ease-in-out ${editingMemberId === item.id ? "bg-yellow-100" : "bg-white"}`} onClick={()=>setEditingMemberId(item.id)}>
              <td>
                {/* Checkbox for each member */}
                <input
                  type="checkbox"
                  checked={selecteditems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{item.qty}</td>
              <td className="px-4 py-2 whitespace-nowrap">{item.serial_number}</td>
              <td className="px-4 py-2 whitespace-nowrap">{item.item_name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{item.issued_to}</td>
              <td className="px-4 py-2 whitespace-nowrap">{item.description}</td>
              <td className="px-4 py-2 whitespace-nowrap">{item.date_received}</td>
              <td className="px-4 py-2 whitespace-nowrap">{item.current_condition}</td>              
               <td className="px-6 py-2 whitespace-nowrap">
                {/* Button to delete member */}
                <button onClick={() => handleDelete(item.id)} className='mx-2'>
                 <TrashIcon className="size-4 text-red-600 "/>
                </button>
                          
                {/* Pass member data to the EditMemberDialog */}
                <EditInventoryDialog item={item} itemId={item.id} onUpdate={handleUpdate}  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>      
    </div>
  );
}
