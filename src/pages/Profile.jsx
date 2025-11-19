import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, Calendar, Check, CreditCard, AlertTriangle, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingAnimation from "../components/ui/LoadingAnimation";

const PROFILE_ICONS = [
  { value: "pickleball", icon: "🏓" },
  { value: "horse", icon: "🐴" },
  { value: "paddle", icon: "🎾" },
  { value: "trophy", icon: "🏆" },
  { value: "star", icon: "⭐" },
  { value: "heart", icon: "❤️" },
  { value: "clover", icon: "🍀" },
  { value: "fire", icon: "🔥" },
  { value: "crown", icon: "👑" },
  { value: "gem", icon: "💎" },
  { value: "lightning", icon: "⚡" },
  { value: "sun", icon: "☀️" }
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    profile_icon: "pickleball",
    auto_renew: true
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || "",
        profile_icon: currentUser.profile_icon || "pickleball",
        auto_renew: currentUser.auto_renew !== undefined ? currentUser.auto_renew : true
      });
    } catch (error) {
      // Not logged in, redirect to home
      navigate(createPageUrl("Homepage"));
    }
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      await base44.auth.updateMe(formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Reload user data
      const updatedUser = await base44.auth.me();
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    setIsSaving(false);
  };

  const handleCompletePayment = async () => {
    setIsRedirectingToPayment(true);
    try {
      const response = await base44.functions.invoke('createStripeCheckout', {
        email: user.email,
        customerName: user.full_name,
        metadata: {
          user_id: user.id,
          completing_payment: 'true'
        }
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Failed to redirect to payment. Please try again.");
      setIsRedirectingToPayment(false);
    }
  };

  const handleCancelAccount = async () => {
    try {
      await base44.auth.updateMe({
        membership_status: "expired"
      });
      
      // Send cancellation email
      await base44.integrations.Core.SendEmail({
        to: user.email,
        subject: "Paddock & Paddle Membership Cancelled",
        body: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>We're Sorry to See You Go</h2>
            <p>Your Paddock & Paddle membership has been cancelled.</p>
            <p>Your access will remain active until the end of your current billing period.</p>
            <p>If you change your mind, you can always rejoin our exclusive community!</p>
            <p>Best,<br>The Paddock & Paddle Team</p>
          </div>
        `,
        from_name: "Paddock & Paddle"
      });

      // Logout and redirect
      await base44.auth.logout();
      navigate(createPageUrl("Homepage"));
    } catch (error) {
      console.error("Error cancelling account:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center">
        <LoadingAnimation text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ranch-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ranch-charcoal mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your Paddock & Paddle membership profile</p>
        </div>

        {/* Payment Required Alert */}
        {user?.membership_status !== 'active' && (
          <Card className="shadow-lg mb-8 border-2 border-yellow-400 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-yellow-900 mb-2">
                    Complete Your Membership Payment
                  </h3>
                  <p className="text-yellow-800 mb-4">
                    Your account is currently <strong>inactive</strong>. Complete your payment to unlock full access 
                    to pickleball court bookings and all member benefits.
                  </p>
                  <Button 
                    onClick={handleCompletePayment}
                    disabled={isRedirectingToPayment}
                    className="ranch-gradient text-white gap-2"
                  >
                    {isRedirectingToPayment ? (
                      "Redirecting to Payment..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Complete Payment Now
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Icon Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Profile Icon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {PROFILE_ICONS.map((iconOption) => (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, profile_icon: iconOption.value })}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                      formData.profile_icon === iconOption.value
                        ? 'border-ranch-red bg-ranch-red bg-opacity-10 scale-105'
                        : 'border-gray-200 hover:border-ranch-red'
                    }`}
                  >
                    <span className="text-4xl">{iconOption.icon}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="(614) 123-4567"
                    />
                  </div>
                </div>

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-800">
                    <Check className="w-5 h-5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full ranch-gradient text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Membership Info */}
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Membership Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Member Since</span>
                </div>
                <p className="text-lg font-semibold text-ranch-charcoal">
                  {user?.membership_start_date ? new Date(user.membership_start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                {user?.membership_status === 'active' ? (
                  <p className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Active
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-yellow-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Pending Payment
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Method</span>
                </div>
                <p className="text-lg font-semibold text-ranch-charcoal capitalize">
                  {user?.payment_method || 'Stripe'}
                </p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-ranch-charcoal">Auto-Renew Membership</h4>
                  <p className="text-sm text-gray-600">Automatically renew your membership each month</p>
                </div>
                <Switch
                  checked={formData.auto_renew}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, auto_renew: checked });
                    base44.auth.updateMe({ auto_renew: checked });
                  }}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Payment Management</h4>
                    <p className="text-sm text-yellow-700">
                      To update your payment method or billing information, please contact us at{" "}
                      <a href="mailto:billing@paddockandpaddle.com" className="underline">
                        billing@paddockandpaddle.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Cancel Membership
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your Paddock & Paddle membership. You will lose access to all member
                      benefits including court reservations and exclusive amenities. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Membership</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Cancel Membership
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}