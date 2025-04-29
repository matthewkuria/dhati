import React from 'react'

const page = () => {
  return (
      <div className="">
        <h1 className='text-3xl font-semibold'>Update Tax Rules</h1>
        <form>
            <div>
            <label htmlFor="taxName">Tax Name:</label>
            <input 
                type="text" 
                id="taxName" 
                name="taxName" 
                placeholder="Enter tax name" 
                className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            </div>
            <div className="form-group mt-4">
            <label htmlFor="taxRate" className="form-label">Tax Rate (%):</label>
            <input 
                type="number" 
                id="taxRate" 
                name="taxRate" 
                placeholder="Enter tax rate" 
                className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            </div>
            <button 
            type="submit" 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
            Update
            </button>
        </form>
    </div>
  )
}

export default page