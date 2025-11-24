import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, X, User as UserIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingAnimation from "../ui/LoadingAnimation";
import AuthModal from "../auth/AuthModal";
import { createPageUrl } from "@/utils";

const CourtSelector = ({ selectedCourt, bookedCourts, onCourtSelect, disabled }) => {
  const courts = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Select Court *</Label>
      {disabled ? (
        <p className="text-sm text-amber-600 mb-4">
          Please select a date and time first to see court availability.
        </p>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          Select one court for your 1-hour session.
          {bookedCourts.length > 0 && " Gray courts are already booked for this time slot."}
        </p>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {courts.map((courtNumber) => {
          const isSelected = selectedCourt === courtNumber;
          const isBooked = bookedCourts.includes(courtNumber);
          const isDisabled = disabled || isBooked;
          
          return (
            <button
              key={courtNumber}
              type="button"
              onClick={() => !isDisabled && onCourtSelect(courtNumber)}
              disabled={isDisabled}
              className={`relative aspect-[3/4] rounded-lg border-4 transition-all duration-200 ${
                isDisabled
                  ? 'border-gray-300 bg-gray-200 cursor-not-allowed opacity-60'
                  : isSelected 
                    ? 'border-ranch-red bg-ranch-red shadow-lg scale-105' 
                    : 'border-gray-300 bg-white hover:border-ranch-red hover:shadow-md'
              }`}
            >
              <div className="h-full p-3 flex flex-col items-center justify-center">
                <div className={`w-full flex-1 rounded border-2 ${
                  isDisabled ? 'border-gray-400' : isSelected ? 'border-white' : 'border-gray-400'
                } relative`}>
                  <div className={`absolute top-1/2 left-0 right-0 h-0.5 ${
                    isDisabled ? 'bg-gray-400' : isSelected ? 'bg-white' : 'bg-gray-400'
                  }`}></div>
                  <div className={`absolute top-1/4 left-0 right-0 h-0.5 ${
                    isDisabled ? 'bg-gray-400 opacity-60' : isSelected ? 'bg-white opacity-60' : 'bg-gray-300'
                  }`}></div>
                  <div className={`absolute bottom-1/4 left-0 right-0 h-0.5 ${
                    isDisabled ? 'bg-gray-400 opacity-60' : isSelected ? 'bg-white opacity-60' : 'bg-gray-300'
                  }`}></div>
                </div>
                
                <div className={`mt-2 text-center ${
                  isDisabled ? 'text-gray-500' : isSelected ? 'text-white' : 'text-gray-700'
                }`}>
                  <div className="font-bold text-xl">Court {courtNumber}</div>
                </div>
              </div>
              
              {isBooked && !disabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 rounded-lg">
                  <div className="bg-white px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-gray-700">BOOKED</span>
                  </div>
                </div>
              )}
              
              {isSelected && !isDisabled && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-ranch-red rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedCourt && (
        <div className="bg-ranch-cream p-4 rounded-lg">
          <p className="text-sm font-medium text-ranch-charcoal">
            Selected: Court {selectedCourt} (1 hour session - $40)
          </p>
        </div>
      )}
    </div>
  );
};

export default function PicleballBookingForm({ onClose }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    preferred_date: "",
    preferred_time: "",
    selected_court: null,
    duration: "1_hour",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedCourts, setBookedCourts] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [formData.preferred_date, formData.preferred_time]);

  const checkAuth = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const currentUser = await base44.auth.me();
        
        // Check if user has active membership
        if (!currentUser.membership_status || currentUser.membership_status !== 'active') {
          alert('Active membership required to book courts. Please go to Account Settings (profile icon in top right) to complete your membership payment.');
          onClose();
          return;
        }
        
        setUser(currentUser);
      } else {
        setShowAuthModal(true);
      }
    } catch (error) {
      setShowAuthModal(true);
    }
    setIsCheckingAuth(false);
  };

  const checkAvailability = async () => {
    if (!formData.preferred_date || !formData.preferred_time) {
      setBookedCourts([]);
      return;
    }

    setIsCheckingAvailability(true);
    try {
      // Check for both pending and confirmed bookings to block courts
      const bookings = await base44.entities.PicleballBooking.filter({
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time
      });

      // Filter to only include pending or confirmed bookings (exclude cancelled)
      const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
      const booked = activeBookings.flatMap(booking => booking.selected_courts || []);
      setBookedCourts([...new Set(booked)]);
      
      // Clear selected court if it's now booked
      if (formData.selected_court && booked.includes(formData.selected_court)) {
        setFormData(prev => ({
          ...prev,
          selected_court: null
        }));
      }
    } catch (error) {
      console.error("Error checking court availability:", error);
      setBookedCourts([]);
    }
    setIsCheckingAvailability(false);
  };

  const handleCourtSelect = (courtNumber) => {
    setFormData(prev => ({
      ...prev,
      selected_court: courtNumber
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.preferred_date) {
      alert("Please select a date");
      return;
    }
    
    if (!formData.preferred_time) {
      alert("Please select a time");
      return;
    }
    
    if (!formData.selected_court) {
      alert("Please select a court");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Fetch fresh user data
      const freshUser = await base44.auth.me();
      
      if (!freshUser || !freshUser.email) {
        throw new Error("User authentication failed. Please log out and log back in.");
      }

      // Double-check court is still available before submitting
      const existingBookings = await base44.entities.PicleballBooking.filter({
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time
      });
      const activeBookings = existingBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
      const alreadyBooked = activeBookings.flatMap(booking => booking.selected_courts || []);
      
      if (alreadyBooked.includes(formData.selected_court)) {
        alert("Sorry, this court was just booked by someone else. Please select a different court.");
        await checkAvailability();
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        selected_courts: [formData.selected_court],
        duration: "1_hour",
        message: formData.message,
        name: freshUser.full_name,
        email: freshUser.email,
        phone: freshUser.phone || ""
      };
      
      // 1. Create the booking
      const createdBooking = await base44.entities.PicleballBooking.create(bookingData);
      console.log('✅ Booking created successfully:', createdBooking);
      
      // 2. Prepare email content
      const courtsList = `Court ${formData.selected_court}`;
      
      const customerEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank you for your request, ${freshUser.full_name}!</h2>
          <p>We've received your pickleball court reservation request for Paddock & Paddle. Please note, this is not a final confirmation.</p>
          <p>Our team will review your request and contact you within 24 hours to confirm availability and provide payment details.</p>
          <hr>
          <h3>Your Request Details:</h3>
          <ul>
            <li><strong>Court:</strong> ${courtsList}</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Duration:</strong> 1 hour</li>
            <li><strong>Cost:</strong> $40</li>
          </ul>
          <p>We look forward to seeing you on the court!</p>
          <p>Best,<br>The Paddock & Paddle Team</p>
        </div>
      `;

      const adminEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Pickleball Booking Request</h2>
          <p>A new reservation request has been submitted by ${freshUser.full_name}.</p>
          <hr>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${freshUser.full_name}</li>
            <li><strong>Email:</strong> ${freshUser.email}</li>
            <li><strong>Phone:</strong> ${freshUser.phone || 'Not provided'}</li>
            <li><strong>Court:</strong> ${courtsList}</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Duration:</strong> 1 hour</li>
            <li><strong>Cost:</strong> $40</li>
            <li><strong>Message:</strong> ${formData.message || 'None'}</li>
          </ul>
          <p>Please review and contact the customer to confirm.</p>
        </div>
      `;
      
      // 3. Send emails (both customer and admin)
      try {
        await Promise.all([
          base44.integrations.Core.SendEmail({
            to: freshUser.email,
            subject: `Your Paddock & Paddle Pickleball Request!`,
            body: customerEmailBody,
            from_name: "Paddock & Paddle"
          }),
          base44.integrations.Core.SendEmail({
            to: "info@paddockandpaddle.com",
            subject: `New Pickleball Booking Request from ${freshUser.full_name}`,
            body: adminEmailBody,
            from_name: "Paddock & Paddle Website"
          })
        ]);
        console.log('✅ Both customer and admin emails sent successfully');
      } catch (emailError) {
        console.warn('⚠️ Email sending issue:', emailError.message);
        // Don't fail the booking if emails fail
      }

      // 4. Store booking details for success page
      sessionStorage.setItem('bookingSuccess', JSON.stringify({
        type: 'pickleball',
        courts: courtsList,
        date: formData.preferred_date,
        time: formData.preferred_time,
        duration: '1 hour',
        userName: freshUser.full_name,
        emailSent: true
      }));
      
      // 5. Redirect to success page
      window.location.href = createPageUrl("BookingSuccess");
    } catch (error) {
      console.error('❌ Error submitting booking:', error);
      alert(`Failed to submit booking. Error: ${error?.message || 'Unknown error'}. Please try again or contact support.`);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    await checkAuth();
  };

  if (isCheckingAuth) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <LoadingAnimation text="Loading..." />
        </DialogContent>
      </Dialog>
    );
  }

  if (showAuthModal) {
    return (
      <>
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-ranch-charcoal flex items-center justify-center gap-2">
                <UserIcon className="w-5 h-5 text-ranch-red" />
                Members Only
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              <p className="text-gray-600 mb-6">
                Court reservations are exclusive to Paddock & Paddle members. 
                Please log in or create your membership account to continue.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowAuthModal(true)} 
                  className="w-full ranch-gradient text-white"
                >
                  Log In / Sign Up
                </Button>
                <Button 
                  onClick={onClose} 
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            onClose();
          }}
          onSuccess={handleAuthSuccess}
          defaultTab="login"
        />
      </>
    );
  }

  if (isSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-ranch-red">Booking Request Submitted!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Thank you for your pickleball court reservation request! We'll contact you within 24 hours 
              to confirm your booking and provide payment instructions.
            </p>
            <Button onClick={onClose} className="ranch-gradient text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        {isSubmitting ? (
          <LoadingAnimation text="Submitting your booking request..." />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-ranch-charcoal">
                <Calendar className="w-5 h-5 text-ranch-red" />
                Reserve Your Pickleball Court
              </DialogTitle>
              <p className="text-sm text-gray-600">Booking as: {user?.full_name}</p>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_date">Preferred Date *</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_time">Preferred Time *</Label>
                  <Select
                    value={formData.preferred_time}
                    onValueChange={(value) => handleInputChange('preferred_time', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isCheckingAvailability && (
                <div className="text-center text-sm text-gray-600">
                  Checking court availability...
                </div>
              )}

              <CourtSelector 
                selectedCourt={formData.selected_court}
                bookedCourts={bookedCourts}
                onCourtSelect={handleCourtSelect}
                disabled={!formData.preferred_date || !formData.preferred_time}
              />

              <div className="space-y-2">
                <Label htmlFor="message">Special Requests or Notes</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Any special requests, group size, or additional information..."
                  rows={4}
                />
              </div>

              <div className="bg-ranch-cream p-4 rounded-lg">
                <h4 className="font-semibold text-ranch-charcoal mb-2">Booking Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Courts are available daily from 6:00 AM to 10:00 PM</li>
                  <li>• Each court booking is for 1 hour at $40</li>
                  <li>• We'll contact you within 24 hours to confirm availability</li>
                  <li>• Equipment rentals available on-site</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 ranch-gradient text-white"
                  disabled={isSubmitting || !formData.preferred_date || !formData.preferred_time || !formData.selected_court}
                >
                  {isSubmitting ? "Submitting..." : "Request Booking ($40)"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}