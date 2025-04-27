import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog';
import { PencilIcon } from '@heroicons/react/24/solid';

export default  function EditMemberDialog({ member, memberId, onUpdate }) {
  const [open, setOpen] = useState(false);  
 
 const { register, handleSubmit } = useForm({
    defaultValues: {
      full_name: member?.full_name || '',
      member_number: member?.member_number || '',
      membership: member?.membership || '',
      baptism_status: member?.baptism_status || '',
      baptism_date: member?.baptism_date || '',
      marital_status: member?.marital_status || '',
      dob: member?.dob || '',
      gender: member?.gender || '',
      mobile: member?.mobile || '',
      residence: member?.residence || '',
      postal_address: member?.postal_address || '',
      date_joined: member?.date_joined || '',
      date_left: member?.date_left || '',
    },
  });
  // Handle form submission to update the record  
  const onSubmit = async (data) => {
  const formattedFormData = {
      ...data,
      dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
      date_left: data.date_left ? format(data.date_left, 'yyyy-MM-dd') : null,
      date_joined: data.date_joined ? format(data.date_joined, 'yyyy-MM-dd') : null,
      baptism_date: data.baptism_date ? format(data.baptism_date, 'yyyy-MM-dd') : null,
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access_token')}`,
      },
      body: JSON.stringify(formattedFormData),
    });

    if (response.ok) {
      alert('Member updated successfully');
      onUpdate();
       // Close the dialog
      setOpen(false);
    } else {
      const errorData = await response.json();
      console.error('Error updating member:', errorData);
      alert(errorData.member_number);
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
            <DialogTitle>Update your record</DialogTitle>
            <DialogDescription>Make changes to the field details below.</DialogDescription>
          </DialogHeader>

          {/* Form to edit member details */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
           <div className='flex flex-row gap-4'>
             <div className="">
              <div>
                {/* Full Name */}
              <label>Full Name</label>
              <Input {...register('full_name')} placeholder="Full Name" />
            </div>

            {/* Member Number */}
            <div>
              <label>Member Number</label>
              <Input {...register('member_number')} placeholder="Member Number" readOnly />
            </div>
             {/* Type of Membership */}
            <div>
              <label>Membership</label>
                <select {...register("membership")}>
                    <option value="regular">Regular</option>
                    <option value="associate">Associate</option>
                </select>
            </div>
             {/* Baptism Status*/}
            <div>
              <label>Baptism status</label>
              <select {...register("baptism_status")}>
                    <option value="yes">Baptized</option>
                    <option value="no">Not Baptized</option>
                </select>
            </div>
            {/* Baptism Date*/}
            <div>
              <label>Baptism Date</label>
              <Input type="date"  {...register('baptism_date')} placeholder="Baptism date" />
            </div>
            {/* Marital Status */}
            <div>
              <label>Marital Status</label>
               <select {...register("marital_status")} placeholder="Marital Status">
                    <option value="all">Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label>Date of Birth</label>
              <Input type="date" {...register('dob')} placeholder="Date of Birth" />
            </div>

            {/* Gender */}
            <div>
              <label>Gender</label>
                <select {...register("gender")} placeholder="Gender">
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
            </div>
            </div>
            <div className="">
              {/* Mobile */}
            <div>
              <label>Mobile</label>
              <Input {...register('mobile')} placeholder="Mobile" />
            </div>

            {/* Residence */}
            <div>
              <label>Residence</label>
              <Input {...register('residence')} placeholder="Residence" />
            </div>

            {/* Postal Address */}
            <div>
              <label>Postal Address</label>
              <Input {...register('postal_address')} placeholder="Postal Address" />
            </div>

            {/* Date Joined */}
            <div>
              <label>Date Joined</label>
              <Input type="date" {...register('date_joined')} placeholder="Date Joined" />
            </div>

            {/* Date Left */}
            <div>
              <label>Date Left</label>
              <Input type="date" {...register('date_left')} placeholder="Date Left" />
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
