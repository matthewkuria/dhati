/* eslint-disable */
"use client";
import Cookies from 'js-cookie';
import React, { useEffect } from "react";
import { PowerIcon } from '@heroicons/react/24/outline';
import { Suspense, useState } from "react"
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import defaultAvatar from "../public/defaultuser.png"
import GreetingsComponent from "../ui/dashboard/home/greetings";
import DashboardStatistics from "../ui/dashboard/home/statistics";
import Charts from "../ui/dashboard/home/charts";
import { ToastProvider} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isShown, setIshown] = useState(false)
  const [userProfile, setUserProfile] = useState();
  const [profile_image, setProfileImage] = useState(null);

  useEffect(() => {
  const fetchUserProfile = async () => {
    const token = Cookies.get('access_token');
    if (!token) { 
      router.push('/');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/user-profile/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
     
      if (!response.ok) {
         toast({
          variant: "destructive",
          title: "Failed to fetch user data",
          description: "Try again later",
        });
      }

      const data = await response.json();
      setUserProfile(data);
      setProfileImage(`${process.env.NEXT_PUBLIC_API_IMG}${data.member.profile_image}`);
      console.log(data)
      
    } catch (err) {
       toast({
          variant: "destructive",
          title: "Failed to fetch user data",
          description: "The logged in User is Non-Member"
        });
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  fetchUserProfile();
}, []);

  if (loading) {
    return <Loading />;
  } 
   
  function handleClick() {
     setIshown(prevState => !prevState)
  }
 
  return (
    
    <ToastProvider>
      <div className="flex relative justify-end text-xs">
        <div  className="">
          <h1 className="font-bold text-blue-900">{userProfile.member? userProfile.member.full_name:"New Admin(Non-Member)"}</h1>
          <h5 className="text-xs font-semibold text-slate-300">{userProfile.email}</h5>
          <p className="text-xs text-blue-900">Member Number :
            <span className='text-xl font-bold'>{userProfile.member?.member_number || "N/A"}</span>
          </p>
        </div>
        <Image src={ profile_image || defaultAvatar}
          alt="NCMI User Avatar"
          width={60} height={60}
          className="w-16 h-16 rounded-full object-cover border"
          onClick={handleClick}
        />
      {isShown &&
          <div className="absolute top-16 right-0 bg-slate-200 rounded-md p-4">  
           <div className="">
              <h1 className="font-bold text-yellow-600">{userProfile.member? userProfile.member.full_name:"Admin"}</h1>
              <h5 className="text-xs font-semibold">{userProfile.email}</h5>
        </div>  
            <div className=" py-5">
              <Link href="/dashboard/settings" >
                <button className="hover:text-blue-500 px-2 rounded-sm hover:font-semibold">
                  Edit Profile
                </button>
              </Link>
            </div>
            <button className="flex  w-full grow items-center justify-center rounded-md text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-0">            
            <div className="block">              
                <Link href="logout" className="flex  hover:text-red-500">
                  <PowerIcon className="w-6" />Log Out
                </Link>
            </div>
          </button>
        </div>
       }
      </div> 
     
        <main className="bg-slate-100">
           <Suspense fallback={<Loading />}>
            <GreetingsComponent />
            <div className="flex flex-col">
                <DashboardStatistics />
                <div className="mt-4 rounded-md">
                  <Charts />
                </div>
           </div>
           </Suspense>
      </main>
    </ToastProvider>
    )
}
export default Page;