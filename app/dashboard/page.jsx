import React from 'react'

function page() {
  return (
    <div className="">
      <div className="flex relative justify-end text-xs">
        <div className="">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-3xl font-bold">Welcome to the Dashboard</h2>
        <p className="mt-4 text-lg">This is your dashboard where you can manage your account.</p>
      </div>
   </div>
  )
}

export default page