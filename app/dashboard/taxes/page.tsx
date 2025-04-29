import React from 'react'

const page = () => {
  return (
      <div className="">
        <h1>Update Tax Rules</h1>
        <form>
            <div>
                <label htmlFor="taxName">Tax Name:</label>
                <input type="text" id="taxName" name="taxName" placeholder="Enter tax name" />
            </div>
            <div>
                <label htmlFor="taxRate">Tax Rate (%):</label>
                <input type="number" id="taxRate" name="taxRate" placeholder="Enter tax rate" />
            </div>
            <button type="submit">Update</button>
        </form>
    </div>
  )
}

export default page