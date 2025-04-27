import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog';
import { PencilIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';


export default  function EditEventsDialog({ event, eventId, onUpdate }) {
    const [open, setOpen] = useState(false);
 
 const { register, handleSubmit } = useForm({
    defaultValues: {
      title: event?.title|| '',      
      doe: event?.doe|| '',
      description: event?.description|| '',
     venue: event?.venue || '', 
     coordinated_by: event?.coordinated_by,
     budget: event?.budget,
     dept: event?.dept,
    },
  });

  // Handle form submission to update the record
  const onSubmit = async (data) => {
    const formattedFormData = {
      ...data,
      doe: data.doe ? format(data.doe, 'yyyy-MM-dd') : null,
      
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`,
      },
      body:formattedFormData,
    });

    if (response.ok) {
      alert('Event updated successfully');
      onUpdate();
       // Close the dialog
      setOpen(false);
    } else {
      const errorData = await response.json();
      console.error('Error updating Event:', errorData);
      alert('Failed to update Event');
    }
    
  };

  return (
    <>
      {/* Trigger to open the dialog */}
          <Button onClick={() =>setOpen(true)
      } className='bg-white shadow-none p-1' >
      <PencilIcon className="size-5 text-blue-500" />
      </Button>

      {/* The Dialog component */}
      <Dialog open={open} onOpenChange={setOpen}  className="min-w-96">
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg w-full mx-auto p-4 sm:p-6 lg:p-8">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>Make changes to the event details below.</DialogDescription>
          </DialogHeader>

          {/* Form to edit event details */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
           <div className='flex flex-row gap-4'>
             <div className="">
                <div>
                    {/* Total Present */}
                    <label>Name of the event</label>
                    <Input {...register('title')} placeholder="Write a good Title" />
                </div>           
                {/* Date*/}
                <div>
                    <label>Date of the event</label>
                    <Input type="date"  {...register('doe')} placeholder="Date" />
                </div>
                <div>
                    {/* Description */}
                    <label>Description</label>
                    <Input type='textarea' {...register('description')} placeholder="Description Here" />
                </div>
                <div>
                    {/* Venue */}
                    <label>Venue</label>
                    <Input  {...register('venue')} placeholder="Venue" />
                </div>
                <div>
                    {/* Coordinated by */}
                    <label>Coordinated By</label>
                    <Input  {...register('coordinated_by')} placeholder="Coordinated by" />
                </div>
                <div>
                    {/* Budget */}
                    <label>Budget</label>
                    <Input  {...register('budget')} placeholder="Budgeted at" />
                </div>
                
           
                       
            </div>
           </div> 
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
