import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog';
import { PencilIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';

export default function EditAttendanceDialog({ attendance, onUpdate, attendanceId }) {
  const [open, setOpen] = useState(false);
 
 const { register, handleSubmit } = useForm({
    defaultValues: {
      total_present: attendance?.total_present|| '',      
      doa: attendance?.doa|| '',
      present_status: attendance?.present_status || '',      
    },
  });

  // Handle form submission to update the record
  const onSubmit = async (data) => {
    const formattedFormData = {
      ...data,
      doa: data.doa ? format(data.doa, 'yyyy-MM-dd') : null,     
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendances/${attendanceId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access_token')}`,
      },
      body: JSON.stringify(formattedFormData),
    });

    if (response.ok) {
      alert('Attendance updated successfully');
      onUpdate();
       // Close the dialog
      setOpen(false);
    } else {
      const errorData = await response.json();
      console.error('Error updating attendance:', errorData);
      if (errorData.doa) {
        alert(errorData.doa);
      }
      alert("Failed to update attendance")
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
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>Make changes to the attendance details below.</DialogDescription>
          </DialogHeader>

          {/* Form to edit attendance details */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
           <div className='flex flex-row gap-4'>
             <div className="">
              <div>
                {/* Total Present */}
              <label>Members Present</label>
              <Input {...register('total_present')} placeholder="The Number Present" />
            </div>

           
            {/* Date*/}
            <div>
              <label>Date of the attendance</label>
              <Input type="date"  {...register('doa')} placeholder="Date" />
            </div>
            {/* Marital Status */}
            <div>
              <label>Present Status</label>
               <select {...register("present_status")} placeholder="Present/Absent Status">
                    <option value="all">Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                </select>
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
