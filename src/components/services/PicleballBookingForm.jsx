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
import { Calendar, X, User as UserIcon, Users } from "lucide-react";
import LoadingAnimation from "../ui/LoadingAnimation";
import AuthModal from "../auth/AuthModal";
import { createPageUrl } from "@/utils";

const BOOKING_OPTIONS = [
  { spots: 4, type: 'full_court', label: 'Full Court (4 players)', price: 40, description: 'Book the entire court for your group' },
  { spots: 2, type: 'double_open', label: 'Double Open Play (2 players)', price: 30, description: 'Book 2 spots, share court with others' },
  { spots: 1, type: 'single_open', label: 'Single Open Play (1 player)', price: 15, description: 'Book 1 spot, join other players' },
];

const CourtSelector = ({ selectedCourt, courtAvailability, onCourtSelect, disabled, spotsNeeded }) => {
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
          Each court has 4 spots. Select a court with {spotsNeeded} available spot{spotsNeeded > 1 ? 's' : ''}.
        </p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {courts.map((courtNumber) => {
          const availability = courtAvailability[courtNumber] || { bookedSpots: 0, availableSpots: 4 };
          const isSelected = selectedCourt === courtNumber;
          const hasEnoughSpots = availability.availableSpots >= spotsNeeded;
          const isFullyBooked = availability.availableSpots === 0;
          const isDisabled = disabled || !hasEnoughSpots;
          
          return (
            <button
              key={courtNumber}
              type="button"
              onClick={() => !isDisabled && onCourtSelect(courtNumber)}
              disabled={isDisabled}
              className={`relative rounded-lg border-4 transition-all duration-200 p-4 ${
                isDisabled
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                  : isSelected 
                    ? 'border-ranch-red bg-ranch-red shadow-lg scale-105' 
                    : 'border-gray-300 bg-white hover:border-ranch-red hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  Court {courtNumber}
                </div>
                
                {/* 4-spot grid visualization */}
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {[1, 2, 3, 4].map((spot) => {
                    const isSpotBooked = spot <= availability.bookedSpots;
                    return (
                      <div
                        key={spot}
                        className={`w-6 h-6 mx-auto rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          isSpotBooked
                            ? 'bg-gray-400 border-gray-500 text-white'
                            : isSelected
                              ? 'bg-white border-white text-ranch-red'
                              : 'bg-green-100 border-green-400 text-green-700'
                        }`}
                      >
                        {isSpotBooked ? '✗' : spot}
                      </div>
                    );
                  })}
                </div>
                
                <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {isFullyBooked ? (
                    <span className="text-red-500 font-semibold">FULL</span>
                  ) : (
                    <span>{availability.availableSpots} spot{availability.availableSpots !== 1 ? 's' : ''} open</span>
                  )}
                </div>
              </div>
              
              {isSelected && !isDisabled && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-ranch-red text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
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
    spots_needed: 4,
    booking_type: "full_court",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courtAvailability, setCourtAvailability] = useState({});
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const selectedOption = BOOKING_OPTIONS.find(opt => opt.spots === formData.spots_needed);

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
        
        if (!currentUser.membership_status || currentUser.membership_status !== 'active') {
          alert('Active membership required to book courts. Please go to Account Settings to complete your membership payment.');
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
      setCourtAvailability({});
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const bookings = await base44.entities.PicleballBooking.filter({
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time
      });

      const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
      
      // Calculate spots used per court
      const availability = {};
      for (let court = 1; court <= 5; court++) {
        const courtBookings = activeBookings.filter(b => b.selected_court === court);
        const bookedSpots = courtBookings.reduce((sum, b) => sum + (b.spots_booked || 4), 0);
        availability[court] = {
          bookedSpots: Math.min(bookedSpots, 4),
          availableSpots: Math.max(4 - bookedSpots, 0)
        };
      }
      
      setCourtAvailability(availability);
      
      // Clear selected court if it no longer has enough spots
      if (formData.selected_court) {
        const courtAvail = availability[formData.selected_court];
        if (courtAvail && courtAvail.availableSpots < formData.spots_needed) {
          setFormData(prev => ({ ...prev, selected_court: null }));
        }
      }
    } catch (error) {
      console.error("Error checking court availability:", error);
      setCourtAvailability({});
    }
    setIsCheckingAvailability(false);
  };

  const handleSpotsChange = (spots) => {
    const option = BOOKING_OPTIONS.find(opt => opt.spots === spots);
    setFormData(prev => ({
      ...prev,
      spots_needed: spots,
      booking_type: option?.type || 'full_court',
      selected_court: null // Reset court selection when spots change
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.preferred_date || !formData.preferred_time || !formData.selected_court) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const freshUser = await base44.auth.me();
      
      if (!freshUser || !freshUser.email) {
        throw new Error("User authentication failed. Please log out and log back in.");
      }

      // Re-check availability
      const existingBookings = await base44.entities.PicleballBooking.filter({
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        selected_court: formData.selected_court
      });
      const activeBookings = existingBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
      const bookedSpots = activeBookings.reduce((sum, b) => sum + (b.spots_booked || 4), 0);
      const availableSpots = 4 - bookedSpots;
      
      if (availableSpots < formData.spots_needed) {
        alert("Sorry, not enough spots available on this court. Please select a different court.");
        await checkAvailability();
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        selected_court: formData.selected_court,
        spots_booked: formData.spots_needed,
        booking_type: formData.booking_type,
        price_paid: selectedOption.price,
        message: formData.message,
        name: freshUser.full_name,
        email: freshUser.email,
        phone: freshUser.phone || ""
      };
      
      // Create the booking
      const createdBooking = await base44.entities.PicleballBooking.create(bookingData);
      console.log('✅ Booking created:', createdBooking);
      
      // Add to Google Calendar
      try {
        await base44.functions.invoke('addToGoogleCalendar', {
          booking: {
            ...bookingData,
            id: createdBooking.id
          }
        });
        console.log('✅ Added to Google Calendar');
      } catch (calendarError) {
        console.warn('⚠️ Google Calendar sync issue:', calendarError.message);
      }
      
      // Send emails
      const bookingTypeLabel = selectedOption.label;
      const customerEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank you for your booking, ${freshUser.full_name}!</h2>
          <p>We've received your pickleball court reservation at Paddock & Paddle.</p>
          <hr>
          <h3>Your Booking Details:</h3>
          <ul>
            <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
            <li><strong>Court:</strong> Court ${formData.selected_court}</li>
            <li><strong>Spots Reserved:</strong> ${formData.spots_needed} of 4</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Duration:</strong> 1 hour</li>
            <li><strong>Price:</strong> $${selectedOption.price}</li>
          </ul>
          ${formData.spots_needed < 4 ? '<p><em>Note: You are sharing this court with other open-play participants.</em></p>' : ''}
          <p>We look forward to seeing you on the court!</p>
          <p>Best,<br>The Paddock & Paddle Team</p>
        </div>
      `;

      const adminEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Pickleball Booking</h2>
          <hr>
          <ul>
            <li><strong>Name:</strong> ${freshUser.full_name}</li>
            <li><strong>Email:</strong> ${freshUser.email}</li>
            <li><strong>Phone:</strong> ${freshUser.phone || 'Not provided'}</li>
            <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
            <li><strong>Court:</strong> Court ${formData.selected_court}</li>
            <li><strong>Spots:</strong> ${formData.spots_needed} of 4</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Price:</strong> $${selectedOption.price}</li>
            <li><strong>Message:</strong> ${formData.message || 'None'}</li>
          </ul>
        </div>
      `;
      
      try {
        await Promise.all([
          base44.integrations.Core.SendEmail({
            to: freshUser.email,
            subject: `Your Paddock & Paddle Booking Confirmed!`,
            body: customerEmailBody,
            from_name: "Paddock & Paddle"
          }),
          base44.integrations.Core.SendEmail({
            to: "info@paddockandpaddle.com",
            subject: `New Booking: ${bookingTypeLabel} - ${freshUser.full_name}`,
            body: adminEmailBody,
            from_name: "Paddock & Paddle Website"
          })
        ]);
      } catch (emailError) {
        console.warn('⚠️ Email issue:', emailError.message);
      }

      // Store for success page
      sessionStorage.setItem('bookingSuccess', JSON.stringify({
        type: 'pickleball',
        bookingType: formData.booking_type,
        bookingTypeLabel: bookingTypeLabel,
        court: formData.selected_court,
        spots: formData.spots_needed,
        date: formData.preferred_date,
        time: formData.preferred_time,
        price: selectedOption.price,
        userName: freshUser.full_name
      }));
      
      window.location.href = createPageUrl("BookingSuccess");
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Failed to submit booking: ${error?.message || 'Unknown error'}`);
    }
    
    setIsSubmitting(false);
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        {isSubmitting ? (
          <LoadingAnimation text="Submitting your booking..." />
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
              {/* Booking Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-ranch-red" />
                  How many players? *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {BOOKING_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => handleSpotsChange(option.spots)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.spots_needed === option.spots
                          ? 'border-ranch-red bg-red-50'
                          : 'border-gray-200 hover:border-ranch-red'
                      }`}
                    >
                      <div className="font-semibold text-ranch-charcoal">{option.label}</div>
                      <div className="text-2xl font-bold text-ranch-red">${option.price}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_date">Preferred Date *</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_date: e.target.value, selected_court: null }))}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_time">Preferred Time *</Label>
                  <Select
                    value={formData.preferred_time}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_time: value, selected_court: null }))}
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

              {/* Court Selection */}
              <CourtSelector 
                selectedCourt={formData.selected_court}
                courtAvailability={courtAvailability}
                onCourtSelect={(court) => setFormData(prev => ({ ...prev, selected_court: court }))}
                disabled={!formData.preferred_date || !formData.preferred_time}
                spotsNeeded={formData.spots_needed}
              />

              {/* Summary */}
              {formData.selected_court && (
                <div className="bg-ranch-cream p-4 rounded-lg">
                  <h4 className="font-semibold text-ranch-charcoal mb-2">Booking Summary</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Type:</strong> {selectedOption?.label}</p>
                    <p><strong>Court:</strong> Court {formData.selected_court}</p>
                    <p><strong>Date:</strong> {formData.preferred_date}</p>
                    <p><strong>Time:</strong> {formData.preferred_time} (1 hour)</p>
                    <p className="text-lg font-bold text-ranch-red mt-2">Total: ${selectedOption?.price}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Special Requests or Notes</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
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
                  {isSubmitting ? "Submitting..." : `Book Now ($${selectedOption?.price})`}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}