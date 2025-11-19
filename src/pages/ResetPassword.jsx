import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle, CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import LoadingAnimation from "../components/ui/LoadingAnimation";

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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Get resetToken from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || urlParams.get('resetToken');
    
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
      setIsValidating(false);
    } else {
      setResetToken(token);
      setIsValidating(false);
    }
  }, []);

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(newPassword)) {
      setError("Password does not meet all requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Use the correct Base44 SDK method
      await base44.auth.resetPassword({
        resetToken: resetToken,
        newPassword: newPassword
      });

      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(createPageUrl("Homepage"));
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      
      let errorMessage = "Failed to reset password. Please try again.";
      
      if (err?.data?.detail) {
        if (typeof err.data.detail === 'string') {
          errorMessage = err.data.detail;
        } else if (Array.isArray(err.data.detail)) {
          errorMessage = err.data.detail.map(e => e.msg || e.message).join('; ');
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      const errorStr = String(errorMessage).toLowerCase();
      if (errorStr.includes('invalid') || errorStr.includes('expired') || errorStr.includes('token')) {
        errorMessage = "This reset link has expired or is invalid. Please request a new password reset.";
      }
      
      setError(errorMessage);
    }

    setIsSubmitting(false);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
        <LoadingAnimation text="Validating reset link..." />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-ranch-charcoal mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been updated. You can now log in with your new password.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to homepage...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-ranch-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-ranch-red" />
          </div>
          <CardTitle className="text-2xl font-bold text-ranch-charcoal">
            Reset Your Password
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Enter your new password below
          </p>
        </CardHeader>

        <CardContent>
          {error && !resetToken ? (
            <>
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button
                onClick={() => navigate(createPageUrl("Homepage"))}
                className="w-full ranch-gradient text-white"
              >
                Return to Homepage
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && <PasswordRequirements password={newPassword} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full ranch-gradient text-white"
                disabled={isSubmitting || !newPassword || !confirmPassword}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate(createPageUrl("Homepage"))}
                  className="text-sm text-ranch-red hover:underline"
                >
                  Back to Homepage
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}