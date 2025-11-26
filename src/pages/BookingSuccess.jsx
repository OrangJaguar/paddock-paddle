import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, Users, Mail, Phone, Loader2 } from "lucide-react";

const BOOKING_OPTIONS = {
  'full_court': { label: 'Full Court (4 players)', spots: 4, price: 40 },
  'single_open': { label: 'Single Open Play (1 player)', spots: 1, price: 15 }
};

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    processBookingAfterPayment();
  }, []);

  const processBookingAfterPayment = async () => {
    try {
      // Check if this is a return from Stripe payment
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get('payment');
      const sessionId = urlParams.get('session_id');
      
      // Get pending booking data from sessionStorage
      const pendingBookingData = sessionStorage.getItem('pendingBooking');
      
      if (paymentSuccess === 'success' && pendingBookingData) {
        console.log('Processing booking after successful Stripe payment...');
        
        const bookingData = JSON.parse(pendingBookingData);
        const freshUser = await base44.auth.me();
        
        // Create the booking now that payment is confirmed
        const createdBooking = await base44.entities.PicleballBooking.create({
          ...bookingData,
          status: 'confirmed' // Mark as confirmed since payment succeeded
        });
        console.log('✅ Booking created after payment:', createdBooking);
        
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
        
        // Send confirmation emails
        const bookingOption = BOOKING_OPTIONS[bookingData.booking_type] || BOOKING_OPTIONS['full_court'];
        const bookingTypeLabel = bookingOption.label;
        
        const customerEmailBody = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>Thank you for your booking, ${bookingData.name}!</h2>
            <p>Your payment has been received and your court is confirmed at Paddock & Paddle.</p>
            <hr>
            <h3>Your Booking Details:</h3>
            <ul>
              <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
              <li><strong>Court:</strong> Court ${bookingData.selected_court}</li>
              <li><strong>Spots Reserved:</strong> ${bookingData.spots_booked} of 4</li>
              <li><strong>Date:</strong> ${bookingData.preferred_date}</li>
              <li><strong>Time:</strong> ${bookingData.preferred_time}</li>
              <li><strong>Duration:</strong> 1 hour</li>
              <li><strong>Amount Paid:</strong> $${bookingData.price_paid}</li>
            </ul>
            ${bookingData.spots_booked < 4 ? '<p><em>Note: You are sharing this court with other open-play participants.</em></p>' : ''}
            <p>We look forward to seeing you on the court!</p>
            <p>Best,<br>The Paddock & Paddle Team</p>
          </div>
        `;

        const adminEmailBody = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>New Paid Pickleball Booking</h2>
            <hr>
            <ul>
              <li><strong>Name:</strong> ${bookingData.name}</li>
              <li><strong>Email:</strong> ${bookingData.email}</li>
              <li><strong>Phone:</strong> ${bookingData.phone || 'Not provided'}</li>
              <li><strong>Booking Type:</strong> ${bookingTypeLabel}</li>
              <li><strong>Court:</strong> Court ${bookingData.selected_court}</li>
              <li><strong>Spots:</strong> ${bookingData.spots_booked} of 4</li>
              <li><strong>Date:</strong> ${bookingData.preferred_date}</li>
              <li><strong>Time:</strong> ${bookingData.preferred_time}</li>
              <li><strong>Amount Paid:</strong> $${bookingData.price_paid}</li>
              <li><strong>Message:</strong> ${bookingData.message || 'None'}</li>
            </ul>
          </div>
        `;
        
        try {
          await Promise.all([
            base44.integrations.Core.SendEmail({
              to: bookingData.email,
              subject: `Your Paddock & Paddle Court Booking is Confirmed!`,
              body: customerEmailBody,
              from_name: "Paddock & Paddle"
            }),
            base44.integrations.Core.SendEmail({
              to: "info@paddockandpaddle.com",
              subject: `New Paid Booking: ${bookingTypeLabel} - ${bookingData.name}`,
              body: adminEmailBody,
              from_name: "Paddock & Paddle Website"
            })
          ]);
        } catch (emailError) {
          console.warn('⚠️ Email issue:', emailError.message);
        }
        
        // Clear pending booking data
        sessionStorage.removeItem('pendingBooking');
        
        // Set booking details for display
        setBookingDetails({
          type: 'pickleball',
          bookingType: bookingData.booking_type,
          bookingTypeLabel: bookingTypeLabel,
          court: bookingData.selected_court,
          spots: bookingData.spots_booked,
          date: bookingData.preferred_date,
          time: bookingData.preferred_time,
          price: bookingData.price_paid,
          userName: bookingData.name
        });
      } else {
        // Check for legacy bookingSuccess data (for boarding inquiries)
        const storedData = sessionStorage.getItem('bookingSuccess');
        if (storedData) {
          const data = JSON.parse(storedData);
          setBookingDetails(data);
          sessionStorage.removeItem('bookingSuccess');
        }
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      setError(error.message);
    }
    
    setIsProcessing(false);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardContent className="pt-8 text-center">
            <Loader2 className="w-16 h-16 text-ranch-red mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-ranch-charcoal mb-2">
              Processing Your Booking...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your reservation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-ranch-charcoal mb-2">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {error}. Please contact support if your payment was processed.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Homepage"))}
              className="ranch-gradient text-white"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-ranch-charcoal mb-2">
              No Booking Information Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find your booking details. Please try submitting your request again.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Homepage"))}
              className="ranch-gradient text-white"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ranch-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl">
          <CardHeader className="text-center border-b bg-white">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-ranch-charcoal mb-2">
              {bookingDetails.type === 'pickleball' ? 'Court Booking Request Submitted!' : 'Inquiry Submitted Successfully!'}
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Thank you, {bookingDetails.userName}! We've received your request.
            </p>
          </CardHeader>

          <CardContent className="p-8">
            {bookingDetails.type === 'pickleball' ? (
              <>
                <div className="bg-ranch-cream rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-ranch-charcoal mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-ranch-red" />
                    Your Reservation Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-ranch-red mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Booking Type</p>
                        <p className="font-semibold text-ranch-charcoal">
                          {bookingDetails.bookingTypeLabel || bookingDetails.courts}
                        </p>
                      </div>
                    </div>
                    {bookingDetails.court && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-ranch-red mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Court</p>
                          <p className="font-semibold text-ranch-charcoal">Court {bookingDetails.court}</p>
                        </div>
                      </div>
                    )}
                    {bookingDetails.spots && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-ranch-red mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Spots Reserved</p>
                          <p className="font-semibold text-ranch-charcoal">{bookingDetails.spots} of 4</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-ranch-red mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-ranch-charcoal">{bookingDetails.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-ranch-red mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold text-ranch-charcoal">{bookingDetails.time} (1 hour)</p>
                      </div>
                    </div>
                    {bookingDetails.price && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-semibold text-green-600">${bookingDetails.price}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-900 mb-3">✅ Booking Confirmed!</h3>
                  <p className="text-sm text-green-800">
                    Your court reservation is confirmed. We've added it to our calendar and sent you a confirmation email.
                    {bookingDetails.spots < 4 && " Since you booked open play, you may share the court with other players."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-ranch-cream rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-ranch-charcoal mb-4">📋 What Happens Next?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">1.</span>
                      <span>Our team will review your inquiry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">2.</span>
                      <span>We'll contact you within 24-48 hours to discuss your needs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">3.</span>
                      <span>We'll answer any questions and provide additional information</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-ranch-charcoal mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-ranch-red" />
                Check Your Email
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                We've sent a confirmation email with all the details to your registered email address.
              </p>
              <p className="text-xs text-gray-500">
                💡 Don't see it? Check your spam folder or contact us directly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
              <h3 className="font-semibold text-ranch-charcoal mb-3">Need Immediate Assistance?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+16141234567"
                  className="flex items-center gap-2 text-ranch-red hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>(614) 123-4567</span>
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a
                  href="mailto:info@paddockandpaddle.com"
                  className="flex items-center gap-2 text-ranch-red hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@paddockandpaddle.com</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(createPageUrl("Profile"))}
                variant="outline"
                className="flex-1 border-ranch-red text-ranch-red hover:bg-ranch-red hover:text-white"
              >
                View My Account
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("Homepage"))}
                className="flex-1 ranch-gradient text-white"
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}