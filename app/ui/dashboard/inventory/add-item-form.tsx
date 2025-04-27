/* eslint-disable */
'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inventorySchema } from '../../../schemas/inventorySchema';
import {createInventory} from "../../../../utils/api"
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
import {useRouter} from 'next/navigation';
import { useState } from 'react';

export default  function AddInventoryForm() {
  const router = useRouter();
  const [error, setError] = useState("");

   const form = useForm<z.infer<typeof inventorySchema>>({
     resolver: zodResolver(inventorySchema),
     defaultValues: {
        qty: '',
        serial_number: '',
        item_name: '',
        description: '',
        issued_to:'church',
        current_condition:'good'
     }
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
  });

  const onSubmit = async ( values: z.infer<typeof inventorySchema>) =>
  {
    const formattedFormData = {
      ...values,
      date_received: values.date_received ? format(values.date_received, 'yyyy-MM-dd') : null,
    };

    try {
      await createInventory(formattedFormData);
      router.push('/dashboard/inventory')
    } catch (error) {
      setError("Failed to add member")
    }
    
    console.log(values)
  }

  return (   
    <div className="max-w-lg mx-auto p-4 text-xs">
      <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quantity */}          
          <FormField
            control={form.control}
            name='qty'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="text"
                  placeholder='Quantity'
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                  <FormMessage/>
              </FormItem>
            )}            
          />  

          {/* Serial Number */}
          <FormField
            control={form.control}
            name='serial_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <Input
                  type="text"
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <FormMessage/>
              </FormItem>
            )}            
          />    
          {/* Item Name */}
          <FormField
            control={form.control}
            name='item_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
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
            {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Description</FormLabel>
                <Input
                  type="text"
                  {...field}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                  <FormMessage/>
              </FormItem>
            )}            
          />  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Custodian */}
          <FormField
          control={form.control}
          name="issued_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custodian</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Custodian" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="none">Select Custodian</SelectItem>
                    <SelectItem value="church">Church</SelectItem>
                    <SelectItem value="bible school">Bible School</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
          />
        {/* Date Received */}
        <FormField
          control={form.control}
          name="date_received"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Received</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[160px] pl-3 text-left font-normal",
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
        {/* Current Condition */}
        <FormField
          control={form.control}
          name="current_condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item Condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="none">Select</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="faulty">Faulty</SelectItem>
                    <SelectItem value="poor">Bad</SelectItem>
                </SelectContent>
              </Select>              
              <FormMessage />
            </FormItem>
          )}
        /> 
            </div>       

        {/* Submit Button */}
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
          Add item
        </Button>
        </form>
       </Form>
    </div>
  );
}
