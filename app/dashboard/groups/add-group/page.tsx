'use client';

import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookies'; // Ensure this function is correctly implemented

export default function AddGroupForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coordinated_by, setCoordinated] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [members, setMembers] = useState<string[]>([]);
    
    useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`, // Replace 'access_token' with your actual cookie key
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAllMembers(data); 
        console.log(members)
      } catch (err) {
        setError('Error fetching members. Please try again.');
      }
    };

    fetchMembers();
  }, []);
const handleMemberChange = (id: string) => {
  setMembers((prev) =>
    prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
  );
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format the form data
    const formattedFormData = {
      name,
      description,
      coordinated_by,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('access_token')}`, // Replace 'access_token' with your actual cookie key
        },
        body: JSON.stringify(formattedFormData), // Convert data to JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSuccess('Group added successfully!');
      setError('');
      setName('');
      setDescription('');
    } catch (err) {
      setError('Error adding group. Please try again.');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Group Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label>Coordinated by:</label>
        {allMembers.length > 0 ? (
          <ul className="border p-2 w-full max-h-40 overflow-y-auto">
            {allMembers.map((member) => (
              <li key={member.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={member.full_name}
                  checked={members.includes(member.id)}
                  onChange={() => handleMemberChange(member.id)}
                />
                <span>{member.full_name || member.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading members...</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add Group
      </button>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
