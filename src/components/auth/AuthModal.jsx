import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Lock, Mail, User, Phone, AlertCircle, CreditCard, ArrowRight, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingAnimation from "../ui/LoadingAnimation";
import VerificationCodeInput from "../ui/VerificationCodeInput";

const MEMBERSHIP_PASSWORD = "idinkthereforeiam";

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "Contains a number", test: (p) => /\d/.test(p) },
    { label: "Contains special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => {
        const passes = req.test(password);
        return (
          <div key={index} className="flex items-center gap-2 text-xs">
            {passes ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-gray-300" />
            )}
            <span className={passes ? "text-green-600" : "text-gray-500"}>
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function AuthModal({ isOpen, onClose, onSuccess, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [signupStep, setSignupStep] = useState(1); // 1: Form, 2: Email Verification Code, 3: Payment
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showMembershipInfo, setShowMembershipInfo] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); // State for signup email verification code

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    membershipPassword: ""
  });

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // FIXED: Use the correct Base44 login method
      await base44.auth.loginViaEmailPassword(loginData.email, loginData.password);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError("Invalid email or password. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleSignupStep1 = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!signupData.full_name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!signupData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!signupData.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!validatePassword(signupData.password)) {
      setError("Password does not meet all requirements");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupData.membershipPassword !== MEMBERSHIP_PASSWORD) {
      setError("Invalid membership code. Please contact customer service for assistance.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create account - Base44 automatically sends verification email with CODE
      await base44.auth.register({
        email: signupData.email.trim(),
        password: signupData.password,
        full_name: signupData.full_name.trim(),
        phone: signupData.phone.trim(),
        membership_status: 'pending'
        // email_verified will be FALSE by default
      });

      console.log('Account created! Verification CODE sent by Base44 to email.');

      // Move to email verification code entry screen
      setSignupStep(2);
      setVerificationCode(""); // Clear verification code input
    } catch (registerError) {
      console.error('Registration error:', registerError);
      
      let errorMessage = 'Registration failed';
      if (registerError?.data?.detail) {
        if (Array.isArray(registerError.data.detail)) {
          errorMessage = registerError.data.detail.map(err => err.msg).join('; ');
        } else if (typeof registerError.data.detail === 'string') {
          errorMessage = registerError.data.detail;
        }
      } else if (registerError?.message) {
        errorMessage = registerError.message;
      }

      const errorStr = String(errorMessage).toLowerCase();
      if (errorStr.includes('already exists') || 
          errorStr.includes('duplicate') ||
          errorStr.includes('already registered')) {
        setError("An account with this email already exists. Please log in instead.");
      } else {
        setError(`Registration failed: ${errorMessage}`);
      }
    }

    setIsSubmitting(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }

    // --- DEBUG: See what functions are available ---
    console.log('--- Base44 Auth Object ---', base44.auth);
    // -----------------------------------------------

    setIsSubmitting(true);

    try {
      console.log('Verifying email with code:', verificationCode);

      // FIXED: Pass parameters as an object with email and otpCode keys
      await base44.auth.verifyOtp({
        email: signupData.email.trim(),
        otpCode: verificationCode.trim()
      });

      console.log('✅ Email verified successfully!');

      // After verification, log the user in using the correct function name
      console.log('Logging user in...');
      await base44.auth.loginViaEmailPassword(
        signupData.email.trim(), 
        signupData.password
      );

      console.log('✅ User logged in successfully! Proceeding to payment...');

      // Now proceed to payment (user is verified and logged in)
      await proceedToPayment();
    } catch (error) {
      console.error('Verification error:', error);
      setError("Invalid verification code. Please check your email and try again.");
      setIsSubmitting(false); // Make sure to reset submitting state on error
    }
  };

  const proceedToPayment = async () => {
    setSignupStep(3); // Move to payment step
    setIsSubmitting(true); // Indicate submitting for payment preparation

    try {
      console.log('Creating Stripe checkout session...');

      // Create Stripe checkout - user is already logged in, no need for sessionStorage
      const checkoutResponse = await base44.functions.invoke('createStripeCheckout', {
        email: signupData.email.trim(),
        customerName: signupData.full_name.trim(),
        metadata: {
          full_name: signupData.full_name.trim(),
          phone: signupData.phone.trim(),
          email: signupData.email.trim()
        }
      });

      if (checkoutResponse?.data?.url) {
        console.log('✅ Redirecting to Stripe checkout:', checkoutResponse.data.url);
        window.location.href = checkoutResponse.data.url;
      } else {
        console.error('❌ No checkout URL received');
        setError("Failed to create payment session. Please contact support.");
        setSignupStep(2); // Revert to verification step if payment setup fails
        setIsSubmitting(false); // Reset submitting state
      }
    } catch (error) {
      console.error('❌ Error creating checkout:', error);
      setError("Failed to create payment session. Please contact support.");
      setSignupStep(2); // Revert to verification step if payment setup fails
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // DEBUG: Log available auth methods
      console.log('🔍 Available base44.auth methods:', Object.keys(base44.auth));
      
      // Try the correct method name for Base44 SDK
      await base44.auth.sendPasswordResetOtp(resetEmail);
      setResetCodeSent(true);
    } catch (err) {
      console.error('Password reset request error:', err);
      
      // Show specific error message from Base44
      let errorMessage = "Failed to send reset email. Please check your email address and try again.";
      
      if (err?.data?.detail) {
        if (typeof err.data.detail === 'string') {
          errorMessage = err.data.detail;
        } else if (Array.isArray(err.data.detail)) {
          errorMessage = err.data.detail.map(e => e.msg || e.message).join('; ');
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      // Check for specific known issues
      const errorStr = String(errorMessage).toLowerCase();
      if (errorStr.includes('user not found') || errorStr.includes('no user')) {
        errorMessage = "No account found with this email address. Please check your email or sign up for a new account.";
      } else if (errorStr.includes('email not verified')) {
        errorMessage = "This email is not verified yet. Please complete the signup process first.";
      } else if (errorStr.includes('not a function')) {
        errorMessage = "Password reset is temporarily unavailable. Please contact support at info@paddockandpaddle.com";
      }
      
      setError(errorMessage);
    }

    setIsSubmitting(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetCode || resetCode.length !== 6) {
      setError("Please enter the 6-digit code from your email");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("New password does not meet all requirements");
      return;
    }

    setIsSubmitting(true);

    try {
      await base44.auth.confirmPasswordReset(resetEmail, resetCode, newPassword);
      
      setShowForgotPassword(false);
      setResetCodeSent(false);
      setResetEmail("");
      setResetCode("");
      setNewPassword("");
      setError("");
      
      alert("Password reset successful! Please log in with your new password.");
    } catch (err) {
      console.error('Password reset confirmation error:', err);
      setError("Failed to reset password. Please check your code and try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {isSubmitting && signupStep === 1 ? (
          <div className="py-8">
            <LoadingAnimation text="Creating your account..." />
          </div>
        ) : isSubmitting && signupStep === 3 ? (
          <div className="py-8">
            <LoadingAnimation text="Preparing payment..." />
          </div>
        ) : showForgotPassword ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Reset Password</DialogTitle>
            </DialogHeader>

            {!resetCodeSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 ranch-gradient text-white">
                    Send Code
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>Code sent to {resetEmail}</AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <VerificationCodeInput
                    value={resetCode}
                    onChange={setResetCode}
                    length={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                  />
                  {newPassword && <PasswordRequirements password={newPassword} />}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => { setShowForgotPassword(false); setResetCodeSent(false); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 ranch-gradient text-white">
                    Reset Password
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Members Only</DialogTitle>
              <DialogDescription className="text-center">
                Access exclusive booking and member amenities
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val);
              setSignupStep(1);
              setError("");
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-ranch-red hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" className="w-full ranch-gradient text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {signupStep === 1 && (
                  <form onSubmit={handleSignupStep1} className="space-y-4 mt-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <p className="text-center text-sm text-gray-600">Step 1 of 3: Create Your Account</p>

                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        value={signupData.full_name}
                        onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        placeholder="(614) 123-4567"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Create Password *</Label>
                      <Input
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="Create a strong password"
                        required
                      />
                      {signupData.password && <PasswordRequirements password={signupData.password} />}
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm Password *</Label>
                      <Input
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Membership Code *</Label>
                        <button
                          type="button"
                          onClick={() => setShowMembershipInfo(!showMembershipInfo)}
                          className="text-sm text-ranch-red hover:underline flex items-center gap-1"
                        >
                          What is this?
                          {showMembershipInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                      <Input
                        type="password"
                        value={signupData.membershipPassword}
                        onChange={(e) => setSignupData({ ...signupData, membershipPassword: e.target.value })}
                        placeholder="Enter membership code"
                        required
                      />
                      {showMembershipInfo && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                          <p className="text-yellow-800">
                            This is an exclusive code provided by Paddock & Paddle administration. 
                            If you don't have this code, please contact customer service at{" "}
                            <a href="mailto:info@paddockandpaddle.com" className="underline">
                              info@paddockandpaddle.com
                            </a>
                          </p>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full ranch-gradient text-white" disabled={isSubmitting}>
                      Create Account <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}

                {signupStep === 2 && (
                  <form onSubmit={handleVerifyCode} className="space-y-6 mt-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <p className="text-center text-sm text-gray-600">Step 2 of 3: Verify Your Email</p>

                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>
                        Verification code sent to <strong>{signupData.email}</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-ranch-charcoal mb-2">Check Your Email</h3>
                      <p className="text-sm text-gray-600">
                        Enter the 6-digit verification code sent to your email
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-center block">Verification Code *</Label>
                      <VerificationCodeInput
                        value={verificationCode}
                        onChange={setVerificationCode}
                        length={6}
                      />
                      <p className="text-xs text-gray-500 text-center mt-3">
                        💡 Check your spam folder if you don't see the email
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full ranch-gradient text-white"
                      disabled={isSubmitting || verificationCode.length !== 6}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Proceed to Payment
                          <CreditCard className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      After verification, you'll be redirected to secure Stripe payment
                    </p>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}