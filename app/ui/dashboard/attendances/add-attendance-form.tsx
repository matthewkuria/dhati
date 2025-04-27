/* eslint-disable */
'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendanceSchema } from '../../../schemas/attendanceSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { z } from 'zod';
import { createAttendance } from '@/utils/api';
import {useRouter} from 'next/navigation';
import { useState } from 'react';

export default  function AddAttendanceForm() {
    const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
  });

  const onSubmit = async ( values: z.infer<typeof attendanceSchema>) =>
  {
    const formattedFormData = {
      ...values,
      doa: values.doa ? format(values.doa, 'yyyy-MM-dd') : null,
    };    
    
    try {
      await createAttendance(formattedFormData);
      alert("Attendance record added Successfully!")
      router.push('/dashboard/attendances');  
    } catch (error) {
      setError("Failed");
    }
    console.log(values)
  }

  return (
   
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add an Attendance</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Number Present*/}          
          <FormField
            control={form.control}
            name='total_present'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Members Present</FormLabel>
                <Input
                  type="text"
                  placeholder='Enter present members...'
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                  <FormMessage/>
              </FormItem>
            )}            
          />  
        {/* Date of the attendance */}
        <FormField
          control={form.control}
          name="doa"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of the Attendance</FormLabel>
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>              
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Present Status */}
          <FormField
          control={form.control}
          name="present_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Present Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Present/Absent?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="none">Select</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
          Submit
        </Button>
        </form>
       </Form>
    </div>
  );
}
