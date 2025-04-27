'use client';
import {removeCookie} from "@/utils/cookies"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BounceLoader from "react-spinners/BounceLoader";
export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    removeCookie('access_token')
    router.push('/');  // Redirect to login page
  }, [router]);

  return (
    <BounceLoader size={100}   color="hsla(217, 90%, 48%, 1)" speedMultiplier={3}/>
  );
}
