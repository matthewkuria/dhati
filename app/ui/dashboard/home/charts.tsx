/* eslint-disable */
import { getAttendances, getMembers } from "@/utils/api";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,  
} from "recharts";
import AttendanceLineGraph from "./AttendanceChart"
export default  function DashboardCharts() {
  const [membersCount, setMembersCount] = useState(0)
  const [data, setData] = useState([])
  const [attendanceData, setAttendanceData] = useState([{doa:'',total_present:''}]);
  const [data1, setData1] = useState({})
  const[males, setMales] = useState(0)
  const[females, setFemales] = useState(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


   // Gender Count
  function genderCount(obj:any[]) {
    const male = obj.reduce((sum, curVal) =>
      sum + (curVal.gender === "male"), 0);    
    return {'male': male, 'female' : obj.length - male }
    
  }
   // Fetch the members from the API
  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await getMembers(); // Call the members API endpoint
        setMembersCount(data.length);
        setData(data)
        const newdata = genderCount(data)
        setData1(Array(newdata))
        console.log(Array(newdata))
        setMales(newdata.male)
        setFemales(newdata.female)
        setLoading(false);
      } catch (err) {
        setError('Failed to load members.');
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);
 // Fetch the attendances from the API
 useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAttendances();
        console.log("Fetched data:", data); // Log fetched data

        if (Array.isArray(data)) {
          const formattedData = data.map(entry => ({
            doa: entry.doa,
            total_present: entry.total_present,
          }));
          setAttendanceData(formattedData);
          console.log("Formatted data set in state:", formattedData); // Log formatted data
        } else {
          console.error("Data is not in expected array format:", data);
        }
      } catch (error) {
        console.error("Error loading attendance data:", error);
      }
    };

    loadData();
  }, []);
   console.log("Current attendanceData state:", attendanceData);
  return (
    <main className=" bg-white flex-row md:flex items-center my-5">
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-blue-900 underline my-5">Members distribution</h3>
            <BarChart
            width={380}
            height={250}
            data={[{
                name: "New Creation Church Members",
                male: males,
                female: females,
              },]}
            margin={{
                top: 5,
                right: 30,
                left: 10,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip shared={false} trigger="click" />
            <Legend />
            <Bar dataKey="male" fill="orange" />
            <Bar dataKey="female" fill="purple" />
            </BarChart>
      </div>
      <div className="">
      <h4 className="text-xl font-bold text-blue-900 underline my-5">Church Attendances</h4>
        <AttendanceLineGraph data={attendanceData} />
      </div>
   </main>
  );
}
