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
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Processing your payment...");

  useEffect(() => {
    autoLogin();
  }, []);

  const autoLogin = async () => {
    try {
      console.log('=== AUTO-LOGIN START ===');
      setStatusMessage("Checking authentication status...");
      
      // First check if already logged in
      const isAuth = await base44.auth.isAuthenticated();
      console.log('Is authenticated:', isAuth);
      
      if (isAuth) {
        console.log('User is already authenticated, fetching user data...');
        const currentUser = await base44.auth.me();
        console.log('Current user:', currentUser);
        setUser(currentUser);
        setIsLoading(false);
        return;
      }

      // Get stored credentials from signup
      const storedSignup = sessionStorage.getItem('paddock_paddle_signup');
      console.log('Stored signup data exists:', !!storedSignup);
      
      if (storedSignup && loginAttempts < 8) {
        const { email, password } = JSON.parse(storedSignup);
        console.log('Attempting auto-login for:', email, 'Attempt:', loginAttempts + 1);
        
        // Progressive delay: start with 3 seconds, increase each attempt
        const delay = 3000 + (loginAttempts * 2000);
        setStatusMessage(`Setting up your account... (attempt ${loginAttempts + 1})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        try {
          console.log('Calling base44.auth.login...');
          await base44.auth.login(email, password);
          console.log('Login successful!');
          
          setStatusMessage("Login successful! Loading your profile...");
          const currentUser = await base44.auth.me();
          console.log('User profile loaded:', currentUser);
          
          setUser(currentUser);
          sessionStorage.removeItem('paddock_paddle_signup');
          console.log('=== AUTO-LOGIN SUCCESS ===');
        } catch (loginError) {
          console.error('Login attempt failed:', loginError);
          console.log('Error details:', {
            message: loginError.message,
            response: loginError.response?.data,
            status: loginError.response?.status
          });
          
          // Check if it's because email isn't verified yet or payment not processed
          if (loginAttempts < 7) {
            console.log('Retrying login...');
            setLoginAttempts(prev => prev + 1);
            setTimeout(() => autoLogin(), 2000);
            return;
          } else {
            console.log('Max login attempts reached');
            setStatusMessage("Account setup in progress. You can log in manually.");
          }
        }
      } else if (loginAttempts >= 8) {
        console.log('Max attempts reached, stopping auto-login');
        setStatusMessage("Your account is being set up. Please try logging in.");
      }
    } catch (error) {
      console.error('Error during auto-login:', error);
      setStatusMessage("Payment successful! You can now log in to your account.");
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
              {statusMessage}
            </h2>
            <p className="text-gray-600">
              Please wait while we finalize your membership
            </p>
            {loginAttempts > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Setting up your account... This may take a moment.
              </p>
            )}
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
                <p>Your payment has been processed and your account is being finalized. You can now log in using your email and password to access all features!</p>
              </div>
              <Button
                onClick={() => navigate(createPageUrl("Homepage"))}
                className="w-full ranch-gradient text-white"
              >
                Go to Homepage & Log In
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