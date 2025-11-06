import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthAndLoadUser();
  }, []);

  const checkAuthAndLoadUser = async () => {
    try {
      console.log('=== PAYMENT SUCCESS PAGE - Checking Auth ===');
      
      // The user should already be logged in from the signup flow
      // We just need to verify and fetch their data
      const isAuth = await base44.auth.isAuthenticated();
      console.log('Is authenticated:', isAuth);
      
      if (isAuth) {
        console.log('User is authenticated, fetching user data...');
        const currentUser = await base44.auth.me();
        console.log('User data loaded:', currentUser);
        setUser(currentUser);
      } else {
        console.log('User is not authenticated (unexpected - they should be logged in already)');
        // If somehow they're not logged in, they can use the "Go to Homepage & Log In" button
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      // If there's an error, just show the success message without user data
      // They can still log in manually
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-ranch-red mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-ranch-charcoal mb-2">
              Loading your account...
            </h2>
            <p className="text-gray-600">
              Please wait while we finalize your membership
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ranch-cream flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-ranch-charcoal mb-2">
            {user ? `Welcome, ${user.full_name}!` : 'Payment Successful!'}
          </CardTitle>
          <p className="text-gray-600 text-lg">
            {user 
              ? 'Your membership is active and you\'re ready to book courts!' 
              : 'Your membership payment has been processed successfully'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              You're All Set!
            </h3>
            <p className="text-green-700 mb-4">
              {user 
                ? 'Your account is verified, payment confirmed, and you\'re logged in. Start booking courts now!'
                : 'Check your email for your welcome message with all membership details.'}
            </p>
            <div className="space-y-2 text-sm text-green-700">
              <p>✓ Payment confirmed</p>
              <p>✓ Email verified</p>
              <p>✓ Membership active</p>
              {user && <p>✓ Logged in and ready</p>}
            </div>
          </div>

          {user && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate(createPageUrl("Services"))}
                className="flex-1 ranch-gradient text-white"
              >
                Book a Court Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("Profile"))}
                variant="outline"
                className="flex-1"
              >
                View My Account
              </Button>
            </div>
          )}

          {!user && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Your Account is Ready!</p>
                <p>Your payment has been processed and your account is active. You should already be logged in! If you see this message, try refreshing the page or clicking the button below to return to the homepage.</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full mb-2"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("Homepage"))}
                className="w-full ranch-gradient text-white"
              >
                Go to Homepage
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{" "}
              <a href="mailto:info@paddockandpaddle.com" className="text-ranch-red underline">
                info@paddockandpaddle.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}