'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../../../schemas/eventSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { z } from 'zod';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookies';

export default function AddEventForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      venue: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
  console.log('Form submitted with values:', values);
  const formattedFormData = new FormData();
  formattedFormData.append('title', values.title);
  formattedFormData.append('description', values.description);
  formattedFormData.append('venue', values.venue);
  formattedFormData.append('doe', values.doe ? format(values.doe, 'yyyy-MM-dd') : '');
  if (file) {
    formattedFormData.append('event_image', file);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie('access_token')}`,
      },
      body: formattedFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      setError(errorData.message || 'An error occurred');
    } else {
      alert('Event added successfully!');
      router.push('/dashboard/events');
    }
  } catch (error) {
    console.error('Request failed', error);
    setError('Failed to add event.');
  }
};


  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Schedule an Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Event Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <Input type="text" placeholder="Event Title" {...field} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of the Event */}
          <FormField
            control={form.control}
            name="doe"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of the Event</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('w-full', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
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

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Input type="text" {...field} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Event Image */}
          <FormItem>
            <Label htmlFor="file">Event Image</Label>
            <Input
              type="file"
              id="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="w-full" />
          </FormItem>

          {/* Venue */}
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <Input type="text" {...field} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Submit Button */}
          <Button type="submit" className="bg-blue-500 text-white w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
