import React from 'react'

const page = () => {
  return (
      <div className="">
        <h1 className="text-2xl font-bold mb-4">User Accounts</h1>
        <ul className="list-disc pl-5">
            <li>John Doe - Admin</li>
            <li>Jane Smith - Editor</li>
            <li>Bob Johnson - Viewer</li>
        </ul>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Manage Accounts
        </button>
    </div>
  )
}

export default page