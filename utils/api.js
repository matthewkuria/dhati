import { getCookie } from './cookies';

const API_URL = 'https://chms.ncmi-ke.org/api'; // Update with your Django API URL

// Function to get headers with the access token from cookies
const getHeaders = () => {
  const accessToken = getCookie('access_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`, // Assuming you're using JWT
  };
};

// Members API
export const createMember = async (memberData) => {
  const response = await fetch(`${API_URL}/members/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(memberData),
  });
  return response.json();
};

export const getMembers = async () => {
  const response = await fetch(`${API_URL}/members/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return response.json();
};

export const updateMember = async (memberId, memberData) => {
  const response = await fetch(`${API_URL}/members/${memberId}/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(memberData),
  });
  return response.json();
};

export const deleteMember = async (id) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getCookie('access_token')}`,
    },
  });
};


// Attendance API
export const createAttendance = async (attendanceData) => {
  const response = await fetch(`${API_URL}/attendances/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(attendanceData),
  });
  return response.json();
};

export const getAttendances = async () => {
  const response = await fetch(`${API_URL}/attendances/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return response.json();
};

export const updateAttendance = async (attendanceId, attendanceData) => {
  const response = await fetch(`${API_URL}/attendances/${attendanceId}/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(attendanceData),
  });
  return response.json();
};

export const deleteAttendance = async (attendanceId) => {
  const response = await fetch(`${API_URL}/attendances/${attendanceId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// Events API
export const createEvent = async (eventData) => {
  const response = await fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(eventData),
  });
  return response.json();
};

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return response.json();
};

export const updateEvent = async (eventId, eventData) => {
  const response = await fetch(`${API_URL}/events/${eventId}/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(eventData),
  });
  return response.json();
};

export const deleteEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/events/${eventId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// Inventory API
export const createInventory = async (inventoryData) => {
  const response = await fetch(`${API_URL}/inventory/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(inventoryData),
  });
  return response.json();
};

export const getInventory = async () => {
  const response = await fetch(`${API_URL}/inventory/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return response.json();
};

export const updateInventory = async (inventoryId, inventoryData) => {
  const response = await fetch(`${API_URL}/inventory/${inventoryId}/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(inventoryData),
  });
  return response.json();
};

export const deleteInventory = async (inventoryId) => {
  const response = await fetch(`${API_URL}/inventory/${inventoryId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

// Function to fetch member details
export const getMemberDetails = async () => {
 const token = getCookie('access_token'); // Get the token from cookies

  const response = await fetch(`${API_URL}/members/member-detail/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // Include the token in the request
    },
    credentials: 'include', // Ensure cookies are sent
  });
  if (!response.ok) {
    throw new Error('Failed to fetch member details');
  }

  return await response.json(); // Return the member details
};

// Function to update member details
export const updateMemberDetails = async (memberData) => {
  const token = getCookie('access_token'); // Get the token from cookies

  const response = await fetch('https://chms-backend.onrender.com/api/members/member-detail/', {
    method: 'PUT', // Use PUT method to update
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // Include the token in the request
    },
    body: JSON.stringify(memberData), // Send the updated member data
  });

  if (!response.ok) {
    throw new Error('Failed to update member details');
  }

  return await response.json(); // Return the updated member details
};


export const createGroup = async (groupData) => {
  const response = await fetch(`${API_URL}/groups/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(groupData),
  });
  return response.json();
};

export const getGroups = async () => {
  const response = await fetch(`${API_URL}/groups/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return response.json();
};

export const updateGroup = async (groupId, groupData) => {
  const response = await fetch(`${API_URL}/groups/${groupId}/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(groupData),
  });
  return response.json();
};

export const deleteGroup = async (groupId) => {
  const response = await fetch(`${API_URL}/groups/${groupId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};