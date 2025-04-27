/* eslint-disable */
"use client";
import Cookies from 'js-cookie';
import React, { useEffect } from "react";
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import defaultAvatar from "../public/defaultuser.png"
import GreetingsComponent from "../ui/member-dashboard/home/greetings";
import DashboardStatistics from "../ui/member-dashboard/home/statistics";
import { ToastProvider} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/app/context/AuthContext";
const Page = () => {
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isShown, setIshown] = useState(false)
  const [userProfile, setUserProfile] = useState();
  const [profile_image, setProfileImage] = useState(null);
  const router = useRouter();

  
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
        throw new Error('Failed to fetch user profile.');
      }

      const data = await response.json();

      setUserProfile(data);
      setProfileImage(`${process.env.NEXT_PUBLIC_API_IMG}${data.member.profile_image}`);
      console.log(data)
      
    } catch (err) {
       toast({
          variant: "destructive",
          title: "You are a new member",
          description: "Click my details to be a member"
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
          <h1 className="font-bold text-blue-900">{userProfile.member? userProfile.member.full_name:"New Member"}</h1>
          <h5 className="text-xs font-semibold text-slate-300">{userProfile.email}</h5>
          <p className="font-bold text-red-500 animate-pulse">{userProfile.member ? "": "Click on My details"}</p>
          {userProfile.member &&
          <p className="text-xs text-blue-900">Member Number :
            <span className='text-xl font-bold'>{userProfile.member?.member_number || "N/A"}</span>
          </p>}
        </div>
        <Image src={ profile_image || defaultAvatar}
          alt="profile pic"
          width={60} height={60}
          className="w-16 h-16 rounded-full object-cover border"
          onClick={handleClick}
        />
      {isShown &&
          <div className="absolute top-16 right-0 bg-slate-200 rounded-md p-4">  
            <div className="">
              <h4 className="">{userProfile.member? userProfile.member.full_name:"Member"}</h4>
              <h5 className="text-xs font-semibold">{userProfile.email}</h5>
        </div>  
            <div className=" py-5">
              <Link href="/member-dashboard/settings" >
                <button className="text-red-500 hover:text-blue-500 px-2 rounded-sm font-bold hover:font-semibold">
                  {userProfile.member ? "Update  details": ""}
                </button>
              </Link>
              <Link href="/member-dashboard/my-details" >
                <button className="text-red-500 hover:text-blue-500 px-2 rounded-sm font-bold hover:font-semibold">
                  {userProfile.member ? "": "Become a Member Now"}
                </button>
              </Link>
            </div>
            <button className="flex  w-full grow items-center justify-center rounded-md text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-0">            
            <div className="block">              
                <Link href="logout" className="flex hover:text-red-500">
                  <PowerIcon className="w-6" />
                  Log Out
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
           </div>
           </Suspense>
      </main>
      </ToastProvider>
    )
}
export default Page;


