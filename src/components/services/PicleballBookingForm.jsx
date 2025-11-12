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

const CourtSelector = ({ selectedCourts, bookedCourts, onCourtToggle }) => {
  const courts = [
    { number: 1, type: "premium", name: "Court 1 - Premium" },
    { number: 2, type: "standard", name: "Court 2 - Standard" },
    { number: 3, type: "standard", name: "Court 3 - Standard" },
    { number: 4, type: "premium", name: "Court 4 - Premium" },
    { number: 5, type: "standard", name: "Court 5 - Standard" }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Select Court(s) *</Label>
      <p className="text-sm text-gray-600 mb-4">
        Click on the courts you'd like to reserve. You can select multiple courts.
        {bookedCourts.length > 0 && " Gray courts are already booked for this time slot."}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {courts.map((court) => {
          const isSelected = selectedCourts.includes(court.number);
          const isBooked = bookedCourts.includes(court.number);
          const isPremium = court.type === "premium";
          
          return (
            <button
              key={court.number}
              type="button"
              onClick={() => !isBooked && onCourtToggle(court.number)}
              disabled={isBooked}
              className={`relative aspect-[3/4] rounded-lg border-4 transition-all duration-200 ${
                isBooked
                  ? 'border-gray-300 bg-gray-200 cursor-not-allowed opacity-60'
                  : isSelected 
                    ? 'border-ranch-red bg-ranch-red shadow-lg scale-105' 
                    : 'border-gray-300 bg-white hover:border-ranch-red hover:shadow-md'
              }`}
            >
              {/* ... court visual styles ... */}
            </button>
          );
        })}
      </div>
      
      {selectedCourts.length > 0 && (
        <div className="bg-ranch-cream p-4 rounded-lg">
          <p className="text-sm font-medium text-ranch-charcoal">
            Selected: {selectedCourts.sort((a, b) => a - b).map(c => `Court ${c}`).join(', ')}
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
    selected_courts: [],
    duration: "2_hours",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // This is no longer used for success
  const [bookedCourts, setBookedCourts] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [error, setError] = useState(""); // State for user-facing errors

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
      const bookings = await base44.entities.PicleballBooking.filter({
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        status: "confirmed"
      });
      const booked = bookings.flatMap(booking => booking.selected_courts || []);
      setBookedCourts([...new Set(booked)]);
      setFormData(prev => ({
        ...prev,
        selected_courts: prev.selected_courts.filter(c => !booked.includes(c))
      }));
    } catch (error) {
      console.error("Error checking court availability:", error);
      setBookedCourts([]);
    }
    setIsCheckingAvailability(false);
  };

  const handleCourtToggle = (courtNumber) => {
    setFormData(prev => ({
      ...prev,
      selected_courts: prev.selected_courts.includes(courtNumber)
        ? prev.selected_courts.filter(c => c !== courtNumber)
        : [...prev.selected_courts, courtNumber]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selected_courts.length === 0) {
      alert("Please select at least one court");
      return;
    }
    
    setIsSubmitting(true);
    setError(""); // Clear previous errors
    
    try {
      // --- THIS IS THE FIX ---
      // Get the 100% fresh, currently authenticated user object
      const freshUser = await base44.auth.me();
      
      // Check if user (or email) is somehow missing
      if (!freshUser || !freshUser.email) {
        throw new Error("User authentication failed. Please log out and log back in.");
      }

      // Now, build the booking data with the FRESH user
      const bookingData = {
        ...formData,
        name: freshUser.full_name,
        email: freshUser.email,
        phone: freshUser.phone || ""
      };
      
      // 1. Create the booking
      await base44.entities.PicleballBooking.create(bookingData);
      
      // 2. Prepare emails
      const courtsList = formData.selected_courts.sort((a, b) => a - b).map(c => `Court ${c}`).join(', ');
      const customerEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank you for your request, ${freshUser.full_name}!</h2>
          <p>We've received your pickleball court reservation request for Paddock & Paddle. Please note, this is not a final confirmation.</p>
          <p>Our team will review your request and contact you within 24 hours to confirm availability and provide payment details.</p>
          <hr>
          <h3>Your Request Details:</h3>
          <ul>
            <li><strong>Courts:</strong> ${courtsList}</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Duration:</strong> ${formData.duration.replace('_', ' ')}</li>
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
            <li><strong>Selected Courts:</strong> ${courtsList}</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Duration:</strong> ${formData.duration.replace('_', ' ')}</li>
            <li><strong>Message:</strong> ${formData.message || 'None'}</li>
          </ul>
          <p>Please review and contact the customer to confirm.</p>
        </div>
      `;
      
      // 3. Send emails
      await Promise.all([
        base44.integrations.Core.SendEmail({
          to: freshUser.email,
          subject: `Your Paddock & Paddle Pickleball Request!`,
          body: customerEmailBody,
          from_name: "Paddock & Paddle"
        }),
        base44.integrations.Core.SendEmail({
          to: "info@paddockandpaddle.com",
          subject: `New Pickleball Request from ${freshUser.full_name}`,
          body: adminEmailBody,
          from_name: "Paddock & Paddle Website"
        })
      ]);
      
      // 4. Store booking details for success page
      sessionStorage.setItem('bookingSuccess', JSON.stringify({
        type: 'pickleball',
        courts: courtsList,
        date: formData.preferred_date,
        time: formData.preferred_time,
        duration: formData.duration.replace('_', ' '),
        userName: freshUser.full_name
      }));
      
      // 5. Redirect to success page
      window.location.href = '/booking-success';

    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("Failed to submit booking. Please try again or contact support."); // Show user-facing error
    }
    
    // We only reach this on failure, so we can stop the spinner
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
    // ... (AuthModal logic - no changes needed)
    return (
      <>
        {/* ... */}
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

  // This `isSuccess` modal is no longer used, as we redirect
  // if (isSuccess) { ... } 

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
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... (Date and Time inputs) ... */}
              </div>

              {isCheckingAvailability && (
                <div className="text-center text-sm text-gray-600">
                  Checking court availability...
                </div>
               )}

              <CourtSelector 
                selectedCourts={formData.selected_courts}
                bookedCourts={bookedCourts}
                onCourtToggle={handleCourtToggle}
              />

              {/* ... (Duration and Message inputs) ... */}

              <div className="bg-ranch-cream p-4 rounded-lg">
                {/* ... (Booking Information text) ... */}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Booking"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}