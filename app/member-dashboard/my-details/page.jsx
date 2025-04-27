"use client";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditMyDetailsDialog from "@/app/components/EditMyDetailsDialog"
import Link from 'next/link';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

const MyDetailsPage = () => {
    const [member, setMember] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [userProfile, setUserProfile] = useState({ email: '', member: {} });
    const router = useRouter();
   


  const fetchMembers = () => {
    const token = Cookies.get('access_token');
    if (!token) {
      // Redirect to login if there is no access token
      router.push('/');
    } else {
     // Decode token or make API call to verify role
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/user-profile/`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,  // Token obtained after login
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  // Handle data
  console.log(data)
    setMember(Array(data.member))
      setUserProfile({
      email: data.email,
        member: data.member,    
    });
})
.catch(error => {
  console.error('Error fetching profile', error);
});
}  
}
  
  useEffect(() => {
    fetchMembers();
  }, []);  

 if (!userProfile.member) {
    return (
      <div>
        <p className="text-xl font-bold">Become a Member</p>
        {/* Add Member Button */}
      <Link href="my-details/add-details" className="bg-white text-white px-4 py-2 mb-4 flex flex-col items-center">
          <UserPlusIcon className='size-6 text-blue-700 hover:size-5 ' />
          <p className="text-blue-600">Add your details</p>
      </Link>
      </div>
      
    );
  }
  const handleUpdate = () => {
    fetchMembers();   
  };
    return (
        <article className='grid  gap-4 p-4'>
            <div className="flex flex-col space-y-4">
                <h1 className='text-2xl text-blue-700 font-bold'>My Details</h1>
                {member.map((member) => ( 
            <div key={member.id} className="bg-white p-4 rounded shadow-md">
            <div>
                <strong>Number:</strong> {member.member_number || "N/A"}
            </div>
            <div>
                <strong>Name:</strong> {member.full_name || "N/A"}
            </div>
            <div>
                <strong>Membership:</strong> {member.membership || "N/A"}
            </div>
            <div>
                <strong>Gender:</strong> {member.gender  || "N/A"}
            </div>
            <div>
                <strong>Phone:</strong> {member.mobile  || "N/A"}
            </div>
            <div>
                <strong>D.O.B:</strong> {member.dob  || "N/A"}
            </div>
            <div>
                <strong>Marrital Status:</strong> {member.marital_status || "N/A"}
            </div>
            <div>
                <strong>Address:</strong> {member.postal_address ||"N/A"}
            </div>
            <div>
                <strong>Residence:</strong> {member.residence || "N/A"}  
            </div>
            <div>
                <strong>Postal Address:</strong> {member.postal_address || "N/A"}
            </div>
            <div>
                <strong>Date Joined:</strong> {member.date_joined   || "N/A"}
            </div>
            <div>
                <strong>Date Left:</strong> {member.date_left   || "N/A"}
            </div>
            <div className="flex flex-col items-center text-xs">
                <EditMyDetailsDialog member={member} memberId={member.id} onUpdate={handleUpdate} />
                <p className="">Edit</p>
            </div>
            </div> 
                ))}
            </div>
        </article>
    );
};

export default MyDetailsPage;

 