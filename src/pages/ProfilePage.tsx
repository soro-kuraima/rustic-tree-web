import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../stores/auth-store';
import { useClerkUserSync } from '../hooks/useClerkUserSync';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import BookingSummary from '../components/booking/BookingSummary';
import { toast } from 'sonner';
import { User } from 'lucide-react';

interface ProfileFormValues {
  name: string;
  email: string;
  phoneNumber: string;
}

const ProfilePage: React.FC = () => {
  // Sync the user data with Convex
  useClerkUserSync();
  
  const { user } = useUser();
  const { userId } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch user data from Convex
  const userData = useQuery(api.users.getUserById, { id: userId });
  
  // Fetch recent bookings
  const recentBookings = useQuery(api.bookings.getRecentUserBookings, { userId, limit: 3 });
  
  // Update user mutation
  const updateUserData = useMutation(api.users.updateUser);
  
  // Form handling
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: userData?.name || user?.fullName || '',
      email: userData?.email || user?.primaryEmailAddress?.emailAddress || '',
      phoneNumber: userData?.phone_number || user?.primaryPhoneNumber?.phoneNumber || '',
    }
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userData) return;
    
    setIsSubmitting(true);
    try {
      await updateUserData({
        tokenIdentifier: `clerk:${user.id}`,
        userData: {
          name: data.name,
          email: data.email,
          // Only include updatable fields here
        }
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user || !userData) {
    return (
      <PageContainer>
        <div className="py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-1/4" />
            </CardFooter>
          </Card>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8 px-4"
      >
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        disabled
                        {...register("email")}
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed. Please update this in your Clerk account.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber"
                        disabled
                        {...register("phoneNumber")}
                      />
                      <p className="text-xs text-gray-500">
                        Phone number cannot be changed. Please update this in your Clerk account.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{user.fullName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{user.primaryEmailAddress?.emailAddress}</p>
                  <p className="text-sm">
                    Account created on:&nbsp;
                    {new Date(userData.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your most recent bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings && recentBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentBookings.map((booking) => (
                      <BookingSummary 
                        key={booking._id} 
                        booking={booking} 
                        isCompact 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent bookings found</p>
                    <Button variant="link" className="mt-2" onClick={() => window.location.href = '/rooms'}>
                      Browse Rooms
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => window.location.href = '/bookings'}>
                  View All Bookings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">
                    Manage your email notification preferences from your Clerk account settings.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-gray-500">
                    The application currently uses your browser's language settings.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Account Management</h3>
                  <p className="text-sm text-gray-500">
                    For account security and account management options, please access your Clerk account settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageContainer>
  );
};

export default ProfilePage;