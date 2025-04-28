'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import  {setCookie} from "@/utils/cookies"
import ScaleLoader from 'react-spinners/ScaleLoader';
import { ToastProvider} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
  e.preventDefault();

  const email = e.target.email.value; // Assuming you have an input for email
    const password = e.target.password.value; // Assuming you have an input for password
    const role = e.target.role.value; // Assuming you have an input for role
    setLoading(true)
    setError('')
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: role,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setLoading(false)
      setSuccess("Successful!")
      toast({
        variant: "success",
        title: "Login Successful",
        description: "Welcome to Dhati dashboard",
      });
      // Store tokens in cookies
      setCookie('access_token', data.access, { expires: 1, secure: true, sameSite: 'Strict' });
      setCookie('refresh_token', data.refresh, { expires: 7, secure: true, sameSite: 'Strict' });
     // Redirect based on user role
      if (role === 'admin') {
        window.location.href = '/dashboard';
      } else if (role === 'employer') {
        window.location.href = '/employer-dashboard';
      } else if (role === 'employee') {
        window.location.href = '/member-dashboard';
      }
    } else {      
       toast({
        variant: "destructive",
        title: "Login failed",
        description: data.error,
      });
      setLoading(false)
      setError(data.error)
    }
  } catch (error) {
     toast({
        variant: "destructive",
        title: "Error during login",
        description: error,
      });
  }
  };
  

  return (
     <ToastProvider>     
    <div className="min-h-screen flex items-center justify-center bg-gray-100">     
        <div className="bg-white p-8 rounded shadow-md w-96">
          <Image src="/dhatiLogo.jpg" alt="NCCI-logo" width={200} height={200} className="mx-auto"/>
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {loading && <ScaleLoader
                color="hsla(217, 90%, 48%, 1)"
                  size={10}
                  speedMultiplier={3}
              /> }
          {error && <p className="text-red-500 font-semibold">{error}</p>}
          {success && <p className="text-green-500 font-semibold">{success}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 w-full rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
            <div className="my-4">
              <p className="">Login as:</p>
                <select
                  name="role"
                  value={role}
                  defaultValue="admin"
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 w-full rounded focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="employer">Employer</option>
                  <option value="employee">Employee</option>
                </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-quaternary"
          >
            Login
          </button>
            <div className='mt-4 flex justify-end'>
            <Link href="signup" className="">Not a member?<span className='text-secondary font-semibold hover:underline border-2 border-slate-200 px-1'>Join Now</span></Link>
          </div>
        </form>
      </div>
    </div>
    </ToastProvider>
  );
}
