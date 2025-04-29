"use client";
import React from 'react'
import api from '../../../utils/api'
import { useEffect, useState } from 'react';

const page = () => {
    const [taxes, setTaxes] = useState<any[]>([]);
     useEffect(() => {
    const fetchData = async () => {
      const taxesRes = await api.get('/employee/taxes/');
        setTaxes(taxesRes.data);
        console.log(taxesRes.data)
    };
    fetchData();
  }, []);
  return (
    <div className="">
        {taxes.length === 0 ? (
            <div>No Taxes at the moment</div>
        ) : (
            <ul>
              {taxes.map((tax) => (
                <li key={tax.id}>
                    <div>Employee: {tax.employee}</div>
                    <div>ID: {tax.id}</div>
                    <div>Period Start: {tax.period_start}</div>
                    <div>Period End: {tax.period_end}</div>
                    <div>Tax Amount: {tax.tax_amount}</div>
                    <div>Tax Rate: {tax.tax_rate}%</div>
                </li>
              ))}
            </ul>
        )}
    </div>
  )
}

export default page