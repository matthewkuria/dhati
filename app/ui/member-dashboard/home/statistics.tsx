"use client"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link";
import eventsIcon from "../../../public/events.png"
import membersIcon from "../../../public/members.png"
import { getEvents } from "@/utils/api"


export default  function DashboardStatistics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  const [eventsCount, setEventsCount] = useState(0)
   
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
    
    return (
        <main className=" flex-row md:flex-row justify-between lg:flex lg:justify-around lg:h-40 md:w-3/4 mt-4 p-3 ">
            <div className=" flex">
              <Link href="/member-dashboard/my-details">
              <Card className="  items-center rounded-lg  w-[150px] h-[150px] mx-2 md:mx-4 md:p-4  hover:border-blue-500 hover:shadow-lg">
                  <CardHeader>
                      <CardTitle>My Details</CardTitle>                   
                  </CardHeader>
                  <CardContent className=" flex flex-col mx-auto items-center">
                    <Image
                        src={membersIcon}
                        alt="the members icon"
                        width={120}
                        height={150}
                        className="justify-center"
                    />
                </CardContent>                               
                </Card>
            </Link>
             <Link href="/member-dashboard/events">
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
          </div>            
        </main>
    )
}