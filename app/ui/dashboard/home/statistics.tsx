/* eslint-disable */
"use client"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import Link from "next/link";
import eventsIcon from "../../../public/events.png"
import membersIcon from "../../../public/members.png"
import inventoryIcon from "../../../public/inventory.png"
import attendanceIcon from "../../../public/attendance.png"
import { getEvents, getInventory, getMembers } from "@/utils/api"


export default  function DashboardStatistics() {
    const [membersCount, setMembersCount] = useState(0)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  const [eventsCount, setEventsCount] = useState(0)
  const [inventoryCount, setInventoryCount] = useState(0)
   // Fetch the members from the API
  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await getMembers(); // Call the members API endpoint
          setMembersCount(data.length); 
        setLoading(false);
      } catch (err) {
        setError('Failed to load members.');
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);
    // Fetch the events from the API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents(); // Call the members API endpoint
          setEventsCount(data.length); 
        setLoading(false);
      } catch (err) {
        setError('Failed to load events.');
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
     // Fetch the events from the API
  useEffect(() => {
    async function fetchInventory() {
      try {
        const data = await getInventory(); // Call the members API endpoint
          setInventoryCount(data.length); 
        setLoading(false);
      } catch (err) {
        setError('Failed to load inventory items');
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);
    return (
        <main className=" flex-row md:flex-row justify-between lg:flex lg:justify-around lg:h-40 md:w-3/4 mt-4 p-3 ">
            <div className="grid grid-cols-2 md:flex gap-5">
              <Link href="/dashboard/members">
              <Card className="  items-center rounded-lg  w-[150px] h-[150px] mx-2 md:mx-4 md:p-4  hover:border-blue-500 hover:shadow-lg">
                  <CardHeader>
                      <CardTitle>Members</CardTitle>                   
                  </CardHeader>
                  <CardContent className=" flex flex-col mx-auto items-center">
                    <Image
                        src={membersIcon}
                        alt="the members icon"
                        width={120}
                        height={150}
                        className="justify-center"
                    />
                    <h3 className="font-bold">{membersCount}</h3>
                </CardContent>                               
                </Card>
            </Link>
             <Link href="/dashboard/events">
            <Card className="bg-white  items-center rounded-lg  w-[150px] h-[150px]  md:mx-4 md:p-4  hover:border-blue-500 hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Events</CardTitle>                   
                </CardHeader>
                <CardContent className=" flex flex-col mx-auto items-center">
                    <Image
                        src={eventsIcon}
                        alt="the events icon"
                        width={30}
                        height={30}
                        className="justify-center"
                    />
                    <h3 className="font-bold">{ eventsCount}</h3>
                </CardContent>                               
            </Card>
          </Link>
          <Link href="/dashboard/inventory">
              <Card className="rounded-lg w-[300px] md:w-[150px] md:h-[150px] mx-2 md:mx-4 md:p-4  hover:border-blue-500 hover:shadow-lg">
                  <CardHeader>
                      <CardTitle>Inventory</CardTitle>                   
                  </CardHeader>
                  <CardContent className="flex flex-col mx-auto items-center">
                    <Image
                        src={inventoryIcon}
                        alt="the members icon"
                        width={120}
                        height={150}
                        className="justify-center"
                    />
                    <h3 className="font-bold">{inventoryCount}</h3>
                </CardContent>                               
                </Card>
            </Link>
            </div>
            <div className="block">
            <Link href="/dashboard/attendances">
            <Card className="bg-blue-50 flex items-center rounded-lg w-[300px] md:w-[250px] h-[150px] mx-2 md:mx-4 md:p-4 mt-4 md:mt-0  hover:border-blue-500 hover:shadow-lg">
                <CardHeader>
                    <CardTitle>View attendances</CardTitle>                   
                </CardHeader>
                <CardContent className=" flex flex-col mx-auto items-center">
                    <Image
                        src={attendanceIcon}
                        alt="NCMI attendance icon"
                        width={120}
                        height={150}
                        className="justify-center"
                    />
                    <ArrowRightIcon className="size-5 animate-bounce"/>
                </CardContent>                               
                </Card>
                </Link>
                
            </div>
        </main>
    )
}