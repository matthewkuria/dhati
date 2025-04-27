"use client";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditMyDetailsDialog from "@/app/components/EditMyDetailsDialog"
import Link from 'next/link';
import { UserPlusIcon } from '@heroicons/react/24/outline';


const MemberDetails =  () => {
  const [member, setMember] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [userProfile, setUserProfile] = useState({ email: '', member:{} });

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
    <div className='text-xs overflow-x-scroll'>
      <h1 className='text-xl underline'>My Details</h1>
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
                    // setSelectedMembers(filteredMembers.map(m => m.id));
                  } else {
                    
                  }
                }}
                // checked={selectedMembers.length === members.length && members.length > 0}
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
          {member.map((member) => (
            <tr key={member.id} className={`hover:bg-gray-100 transition duration-200 ease-in-out ${editingMemberId === member.id ? "bg-yellow-100" : "bg-white"}`} onClick={()=>setEditingMemberId(member.id)}>
              <td>
                {/* Checkbox for each member */}
                <input
                  type="checkbox"
                  // checked={selectedMembers.includes(member.id)}
                  // onChange={() => handleCheckboxChange(member.id)}
                />
              </td>
              <td className="px-1 py-2 whitespace-nowrap">{member.member_number}</td>
              <td className="px-4 py-2 whitespace-nowrap">{member.full_name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{member.membership}</td>
              <td className={`px-4 py-2 ${
                        member.baptism_status === "yes"
                          ? "text-green-500 font-bold"
                          : "text-red-500"
                }`}
              >{member.baptism_status || "Unknown"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{member.baptism_date}</td>
              <td className="px-1 py-2">{member.gender || "N/A"}</td>
              <td className="px-1 py-2">{member.marital_status || "N/A"}</td>
              <td className="px-1 py-2">{member.dob || "N/A"}</td>
              <td className="px-6 py-2">{member.mobile || "N/A"}</td>
              <td className="px-6 py-2">{member.residence || "N/A"}</td>
              <td className="px-6 py-2">{member.postal_address || "N/A"}</td>
              <td className="px-1 py-2">{member.date_joined || "N/A"}</td>
              <td className="px-1 py-2">{member.date_left || "N/A"}</td>
               <td className="px-6 py-2 whitespace-nowrap">
                                         
                {/* Pass member data to the EditMemberDialog */}
                <EditMyDetailsDialog member={member} memberId={member.id} onUpdate={handleUpdate}  />
              </td>
            </tr>
          ))}
        </tbody>
      </table> 
    </div>
  );
};

export default MemberDetails;
