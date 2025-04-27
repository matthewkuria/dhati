/* eslint-disable */
'use client';
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '../../../schemas/memberSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getCookie } from '@/utils/cookies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { z } from 'zod';
import {useRouter} from 'next/navigation';
import { useState } from 'react';

export default function AddMemberForm() {
  const router = useRouter();
  const [error, setError] = useState("");

   const form = useForm<z.infer<typeof memberSchema>>({
     resolver: zodResolver(memberSchema),
     defaultValues: {
        full_name: '',
        member_number: '',
        membership:'regular',
        marital_status: "single",
        mobile: '',
        residence: '',
        postal_address:'',
     }
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = async ( values: z.infer<typeof memberSchema>) =>
  {
    const formattedFormData = {
      ...values,
      dob: values.dob ? format(values.dob, 'yyyy-MM-dd') : null,
      date_left: values.date_left ? format(values.date_left, 'yyyy-MM-dd') : null,
      date_joined: values.date_joined ? format(values.date_joined, 'yyyy-MM-dd') : null,
      baptism_date: values.baptism_date ? format(values.baptism_date, 'yyyy-MM-dd') : null,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('access_token')}`,
      },
      body: JSON.stringify(formattedFormData),
    });

    if (response.ok) {
      alert('Member added successfully');
      router.push("/dashboard/members")
       // Close the dialog
    } else {
      const errorData = await response.json();
      setError(errorData)
      console.log('Error adding member:', errorData);
      alert(errorData.member_number)
    }
    
    } catch (error) {
      setError("Failed to add member")
    }
    
    console.log(values)
  }

  return (   
    <div className="max-w-xl mx-auto p-8 text-xs">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Add New Member</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Full Name */}          
          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  placeholder='Full Name'
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <FormMessage />
              </FormItem>
            )}            
          />  

            {/* Member Number */}
          <FormField
            control={form.control}
            name='member_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Number</FormLabel>
                <Input
                  type="text"
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <FormMessage/>
              </FormItem>
            )}            
          />      
          {/* Membership */}
          <FormField
          control={form.control}
          name="membership"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type of Membership" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="none">Select</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="associate">Associate</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
          />
       </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Baptism Status */}
          <FormField
          control={form.control}
          name="baptism_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baptism Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="none">Select</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">NO</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
          />
             {/* Date of Baptism */}
        <FormField
          control={form.control}
          name="baptism_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Baptism</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[160px] pl-1 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>              
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Marital Status */}
          <FormField
          control={form.control}
          name="marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="none">Select</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>              
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="none">Select</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
        

        

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {/* Mobile */}
          <FormField
            control={form.control}
            name='mobile'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="text"
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                  <FormMessage/>
              </FormItem>
            )}            
          />         

        {/* Residence */}
        <FormField
            control={form.control}
            name='residence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residence</FormLabel>
                <Input
                  type="text"
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                  <FormMessage/>
              </FormItem>
            )}            
          /> 

        {/* Postal Address */}
        <FormField
            control={form.control}
            name='postal_address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Address</FormLabel>
                <Input
                  type="text"
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                  <FormMessage/>
              </FormItem>
            )}            
          /> 
         </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Joined */}
        <FormField
          control={form.control}
          name="date_joined"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Joined at:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>              
              <FormMessage />
            </FormItem>
          )}
        />  
        {/* Date Left */}
        <FormField
          control={form.control}
          name="date_left"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Left</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[250px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>              
              <FormMessage />
            </FormItem>
          )}
        /> 
          </div>       

        {/* Submit Button */}
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
          Add
        </Button>
        </form>
       </Form>
    </div>
  );
}
