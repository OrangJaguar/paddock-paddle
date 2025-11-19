import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, Users, Mail, Phone } from "lucide-react";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Get booking details from sessionStorage
    const storedData = sessionStorage.getItem('bookingSuccess');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setBookingDetails(data);
        // Clear from sessionStorage after reading
        sessionStorage.removeItem('bookingSuccess');
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }
  }, []);

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
                        <p className="text-sm text-gray-600">Selected Courts</p>
                        <p className="font-semibold text-ranch-charcoal">{bookingDetails.courts}</p>
                      </div>
                    </div>
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
                        <p className="font-semibold text-ranch-charcoal">{bookingDetails.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-ranch-red mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-ranch-charcoal">{bookingDetails.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">📋 What Happens Next?</h3>
                  <p className="text-sm text-blue-800">
                    Our team will review your court reservation request, and someone from our team will reach out at the earliest to confirm your booking.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-2">⏱️ Please Note</h3>
                  <p className="text-sm text-yellow-800">
                    This is a <strong>reservation request</strong>, not a final confirmation. 
                    Your courts are not officially reserved until you receive our confirmation email 
                    and complete payment.
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