"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastProvider} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { PropagateLoader } from "react-spinners";

type Person = {
  full_name: string;
  member_number: number;
  membership: string;
  baptism_status: string;
  baptism_date: string;
  marital_status: string;
  dob: string;
  gender: string;
  mobile: number;
  residence: string;
  postal_address: string;
  date_joined: string;
  date_left: string;
  profile_image: string;
};

export default function ProfileSettings() {
  const { toast } = useToast();
  const [member, setMember] = useState<Person>({
    full_name: "",
    member_number: 0,
    membership: "",
    baptism_status: "",
    baptism_date: "",
    marital_status: "",
    dob: "",
    gender: "",
    mobile: 0,
    residence: "",
    postal_address: "",
    date_joined: "",
    date_left: "",
    profile_image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [memberId, setMemberId] = useState(24);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("access_token");
      setLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/user-profile/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const data = await response.json();
        reset(data.member);
        setMember(data.member);
        setMemberId(data.member.id)
        setProfileImage(
          `${process.env.NEXT_PUBLIC_API_IMG}${data.member.profile_image}`
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) { // 2 MB size limit
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "File size should be less than 2MB.",
      });
      return;
    }
    setFile(file);
    setProfileImage(URL.createObjectURL(file));
  }
};


  const onSubmit = async (formData: { [key: string]: string | Blob }) => {
    try {
      setLoading(true);
      // Format date fields
      const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime())
          ? parsedDate.toISOString().split("T")[0] // Extract YYYY-MM-DD
          : ""; // Return empty string for invalid date
      };

      const formattedFormData = new FormData();
      Object.keys(formData).forEach((key) => {

        if (key === "baptism_date" || key === "date_left") {
        formattedFormData.append(key, formatDate(formData[key] as string));
      } else {
        formattedFormData.append(key, formData[key]);
      }
      });

      if (file) {
        formattedFormData.append("profile_image", file);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}/`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
          body: formattedFormData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error(errorData.detail || "Failed to update profile.");
      }


       // Show success toast
      toast({
      variant: "success",
      title: "Profile Updated",
      description: "Your profile details have been updated successfully!",
    });
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update profile details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Profile Settings
      </h2>
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      {loading ? (
        <div className="text-center">          
          <PropagateLoader
            color="#1443fb"
            speedMultiplier={2}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center justify-center space-x-6">
            <img
              src={profileImage || "/defaultuser.webp"}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
            <div>
              <Label htmlFor="profile_image" className="font-semibold">
                Profile Picture
              </Label>
              <Input
                type="file"
                id="profile_image"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>
          </div>
         <div className="grid md:grid-cols-2 gap-6 sm:grid-cols-1">
          {/* Dynamic Fields */}
          {[
            { label: "Full Name", id: "full_name", type: "text", required: true },
            { label: "Member Number", id: "member_number", type: "number", required: true  },
            { label: "Baptism Date", id: "baptism_date", type: "date", required: false },
            { label: "Date Joined", id: "date_joined", type: "date", required: true },
            { label: "Date Left", id: "date_left", type: "date", required: false },
            { label: "Mobile", id: "mobile", type: "tel", required: true },
            { label: "Residence", id: "residence", type: "text", required: true },
            { label: "Postal Address", id: "postal_address", type: "text", required: true },
          ].map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                {...register(field.id, { required: field.required })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full mt-1"
                disabled
              />
              {errors[field.id] && field.required && (
                <p className="text-red-500">
                  {field.label} is required
                </p>
              )}
            </div>
          ))}

          {/* Select Fields for Membership, Baptism Status, Marital Status, Gender */}
          {[
            {
              label: "Membership Type",
              id: "membership",
              options: [
                { value:"regular",  label: "Regular" },
                { value:"associate",  label: "Associate" }
              ],
            },
            {
              label: "Baptism Status",
              id: "baptism_status",
              options: [
              {value:"yes", label:"Baptized"},
              {value:"no", label:"Not Baptized"}
              ],
            },
            {
              label: "Marital Status",
              id: "marital_status",
              options: [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" },
              ],
            },
            {
              label: "Gender",
              id: "gender",
              options: [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ],
            },
          ].map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <select
                id={field.id}
                {...register(field.id, { required: true })}
                className="w-full mt-1 p-2 border rounded-md"
                disabled
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors[field.id] && (
                <p className="text-red-500">{field.label} is required</p>
              )}
            </div>
          ))}

          <div className="pt-6">
            <Button
              type="submit"
               className={`w-full py-2 rounded-lg transition ${
                file ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!file}
            >
              Update Profile
            </Button>
          </div>
          </div>
        </form>
      )}
    </div>
    </ToastProvider>
  );
}
