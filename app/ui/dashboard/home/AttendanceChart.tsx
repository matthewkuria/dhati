import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const AttendanceLineGraph =  (data: any[] | undefined) => {

console.log("Current data:",data)
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="basis" dataKey="total" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceLineGraph;
