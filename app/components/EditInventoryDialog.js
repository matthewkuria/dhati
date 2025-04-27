import React, {  useState } from 'react';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog';
import { PencilIcon } from '@heroicons/react/24/solid';


export default  function EditInventoryDialog({ item, itemId, onUpdate }) {
  const [open, setOpen] = useState(false);  
 
 const { register, handleSubmit } = useForm({
    defaultValues: {
      qty: item?.qty || '',
      serial_number: item?.serial_number || '',
      item_name: item?.item_name || '',
      issued_to: item?.issued_to || '',
      description: item?.description || '',
      date_received: item?.date_received || '',
      current_condition: item?.current_condition || '',
      
    },
  });
  // Handle form submission to update the record  
  const onSubmit = async (data) => {
  const formattedFormData = {
      ...data,
      date_received: data.date_received ? format(data.date_received, 'yyyy-MM-dd') : null,
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${itemId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access_token')}`,
      },
      body: JSON.stringify(formattedFormData),
    });

    if (response.ok) {
      alert('Item updated successfully!');
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
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>Make changes to the item details below.</DialogDescription>
          </DialogHeader>

          {/* Form to edit member details */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
           <div className='flex flex-row gap-4'>
             <div className="">
              <div>
                {/* Quantity */}
              <label>Quantity</label>
              <Input {...register('qty')} placeholder="Quantity" />
            </div>

            {/* Serial Number */}
            <div>
              <label>Serial Number</label>
              <Input {...register('serial_number')} placeholder="Serial Number" />
            </div>
            <div>
                {/* Item name */}
              <label>Item name</label>
              <Input {...register('item_name')} placeholder="Quantity" />
            </div>
             {/* Issue to */}
            <div>
              <label>Issued to</label>
                <select {...register('issued_to')}>
                    <option value="church">Church</option>
                    <option value="bible school">Bible School</option>
                </select>
            </div> 
            </div>
            <div className="">
              {/* Description */}
            <div>
              <label>Description</label>
              <Input {...register('description')} placeholder="Description" />
            </div>
            {/* Date of purchase */}
            <div>
              <label>Date Received</label>
              <Input type="date" {...register('date_received')} placeholder="Date Received" />
            </div>
            {/* Condition */}
            <div>
              <label>Current Condition</label>
                <select {...register('current_condition')}>
                    <option value="good">Good</option>
                    <option value="poor">Bad</option>
                    <option value="faulty">Faulty</option>
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
