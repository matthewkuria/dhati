"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getEvents } from "@/utils/api";
import { LucideLoaderPinwheel } from "lucide-react";
import { PropagateLoader } from "react-spinners";
import locationIcon  from "../public/locationIcon.png";
import calendarIcon  from "../public/calendarIcon.png";


// const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function Announcements() {
    const [events, setEvents] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
        try {
        const data = await getEvents(); // Call the events API endpoint
        setEvents(data); // Populate the events state
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to load events.',error);
        setLoading(false);
      }
        }
        
        fetchEvents();
    }, []);
    if (loading) {
       <LucideLoaderPinwheel /> 
    }
    return (
        <article className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {errorMessage && <div className="error">{errorMessage}</div>}
            {events?.length == 0 ? 
                <PropagateLoader
                    color="#121ded"
                    size={15}
                    speedMultiplier={1.2}
                    />
                :
                <>
                    {events?.map(event => (
                        <Card key={event.id} className="relative">
                            {event.event_image &&
                                <div className="max-h-48 overflow-hidden rounded-lg">
                                    <Image src={event.event_image} alt="The event image" width={400} height={300} className="object-fill"/>
                                </div> 
                            }            
                            <CardHeader>
                                <p className="text-xl font-semibold text-yellow-700">{event.title}</p>
                            </CardHeader>
                            <CardContent className="max-h-40 overflow-y-scroll">
                                <p className="text-slate-600 text-[13px]">{event.description}</p>
                            </CardContent>
                            <CardFooter className="text-blue-900 text-xs">
                                <div className="absolute top-0 right-0 flex items-center font-bold bg-white p-1 rounded-s">
                                    <Image src={calendarIcon} alt="calendar icon" width={30} height={30} />
                                    <p className="">{event.doe}</p>
                                </div>
                                <div className="flex gap-2 items-center font-semibold">
                                    <Image src={locationIcon} alt="location icon" width={20} height={20} />
                                    <p className="">{event.venue}</p>
                                </div>
                            </CardFooter>            
                        </Card>
                    ))}
                </>
            }
        </article>
    )
}