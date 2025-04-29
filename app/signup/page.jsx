/* eslint-disable */
'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ScaleLoader } from 'react-spinners';
import { ToastProvider} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const { toast } = useToast();
  const router = useRouter();  // Next.js router for redirection
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      // Make a POST request to the Django API for signup
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/register/`, formData);
      console.log(response.data);
        setLoading(false)
        setSuccess(true);
        toast({
        variant: "success",
        title: "Sign Up Successful",
        description: "Login to continue",
      });
        setError("")
        // Redirect to login page after successful signup
        router.push('/');  // Redirect user to the login page after signup
    
    } catch (error) {
      setLoading(false)
      console.log(error)
       toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "An error occurred",
      });
      setError(error.response ? error.response.data : 'Signup failed');
    }
  };

  return (
    <ToastProvider>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <Image src="/dhatiLogo.jpeg" alt="Dhati-logo" width={200} height={200} className="mx-auto"/>
        <h2 className="text-xl font-bold mb-6 text-center">Sign Up</h2>  
        {loading && <ScaleLoader
                color="hsla(217, 90%, 48%, 1)"
                  size={10}
                  speedMultiplier={1}
          />}
        {success && <p className="text-green-500">Signup successful! Redirecting to login...</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 w-full rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 w-full rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 w-full rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-quaternary"
          >
            {loading ? "Signing up..." : "Sign up" }
          </button>
          <div className='mt-4 flex justify-end'>
            <Link href="/" className="">Already have account?<span className='text-yellow-600 font-semibold hover:underline border-2 border-slate-200 px-1'>Login</span></Link>
          </div>
        </form>
      </div>
      </div>
    </ToastProvider>
  );
}
