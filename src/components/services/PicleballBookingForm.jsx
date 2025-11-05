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
              <div className="h-full p-3 flex flex-col items-center justify-center">
                <div className={`w-full flex-1 rounded border-2 ${
                  isBooked ? 'border-gray-400' : isSelected ? 'border-white' : 'border-gray-400'
                } relative`}>
                  <div className={`absolute top-1/2 left-0 right-0 h-0.5 ${
                    isBooked ? 'bg-gray-400' : isSelected ? 'bg-white' : 'bg-gray-400'
                  }`}></div>
                  <div className={`absolute top-1/4 left-0 right-0 h-0.5 ${
                    isBooked ? 'bg-gray-400 opacity-60' : isSelected ? 'bg-white opacity-60' : 'bg-gray-300'
                  }`}></div>
                  <div className={`absolute bottom-1/4 left-0 right-0 h-0.5 ${
                    isBooked ? 'bg-gray-400 opacity-60' : isSelected ? 'bg-white opacity-60' : 'bg-gray-300'
                  }`}></div>
                </div>
                
                <div className={`mt-2 text-center ${
                  isBooked ? 'text-gray-500' : isSelected ? 'text-white' : 'text-gray-700'
                }`}>
                  <div className="font-bold text-xl">Court {court.number}</div>
                  <div className={`text-xs font-medium ${
                    isBooked 
                      ? 'text-gray-500'
                      : isPremium 
                        ? (isSelected ? 'text-yellow-200' : 'text-yellow-600') 
                        : (isSelected ? 'text-white' : 'text-gray-500')
                  }`}>
                    {isPremium ? '★ Premium' : 'Standard'}
                  </div>
                </div>
              </div>
              
              {isBooked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 rounded-lg">
                  <div className="bg-white px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-gray-700">BOOKED</span>
                  </div>
                </div>
              )}
              
              {isSelected && !isBooked && (
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
    
    try {
      const bookingData = {
        ...formData,
        name: user.full_name,
        email: user.email,
        phone: user.phone || ""
      };
      
      await base44.entities.PicleballBooking.create(bookingData);
      
      const courtsList = formData.selected_courts.sort((a, b) => a - b).map(c => `Court ${c}`).join(', ');
      
      const customerEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank you for your request, ${user.full_name}!</h2>
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
          <p>A new reservation request has been submitted through the website.</p>
          <hr>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${user.full_name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${user.phone || 'Not provided'}</li>
            <li><strong>Selected Courts:</strong> ${courtsList}</li>
            <li><strong>Date:</strong> ${formData.preferred_date}</li>
            <li><strong>Time:</strong> ${formData.preferred_time}</li>
            <li><strong>Duration:</strong> ${formData.duration.replace('_', ' ')}</li>
            <li><strong>Message:</strong> ${formData.message || 'None'}</li>
          </ul>
          <p>Please review and contact the customer to confirm.</p>
        </div>
      `;

      await Promise.all([
        base44.integrations.Core.SendEmail({
          to: user.email,
          subject: `Your Paddock & Paddle Pickleball Request!`,
          body: customerEmailBody,
          from_name: "Paddock & Paddle"
        }),
        base44.integrations.Core.SendEmail({
          to: "info@paddockandpaddle.com",
          subject: `New Pickleball Request from ${user.full_name}`,
          body: adminEmailBody,
          from_name: "Paddock & Paddle Website"
        })
      ]);

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
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
                selectedCourts={formData.selected_courts}
                bookedCourts={bookedCourts}
                onCourtToggle={handleCourtToggle}
              />

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleInputChange('duration', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_hour">1 Hour</SelectItem>
                    <SelectItem value="2_hours">2 Hours</SelectItem>
                    <SelectItem value="half_day">Half Day (4 hours)</SelectItem>
                    <SelectItem value="full_day">Full Day (8 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  <li>• We'll contact you within 24 hours to confirm availability</li>
                  <li>• Payment is due upon confirmation of your booking</li>
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