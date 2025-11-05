
import React, { useState } from "react";
import { BoardingInquiry } from "@/entities/BoardingInquiry";
import { SendEmail } from "@/integrations/Core";
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
import { Heart, X } from "lucide-react";
import LoadingAnimation from "../ui/LoadingAnimation";

export default function BoardingInquiryForm({ onClose }) {
  const [formData, setFormData] = useState({
    owner_name: "",
    email: "",
    phone: "",
    horse_name: "",
    horse_breed: "",
    horse_age: "",
    boarding_type: "full_boarding", // Updated default boarding type
    start_date: "",
    special_needs: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await BoardingInquiry.create({
        ...formData,
        horse_age: formData.horse_age ? parseInt(formData.horse_age) : undefined
      });

      const customerEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank you for your inquiry, ${formData.owner_name}!</h2>
          <p>We've received your equestrian boarding inquiry for Paddock & Paddle.</p>
          <p>Our equestrian director will review your information and contact you within 48 hours to discuss availability and schedule a tour of our facilities.</p>
          <hr>
          <h3>Your Inquiry Details:</h3>
          <ul>
            <li><strong>Horse Name:</strong> ${formData.horse_name}</li>
            <li><strong>Boarding Type:</strong> ${formData.boarding_type}</li>
            <li><strong>Desired Start Date:</strong> ${formData.start_date || 'Not specified'}</li>
          </ul>
          <p>We look forward to speaking with you soon!</p>
          <p>Best,<br>The Paddock & Paddle Team</p>
        </div>
      `;

      const adminEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Equestrian Boarding Inquiry</h2>
          <p>A new boarding inquiry has been submitted through the website.</p>
          <hr>
          <h3>Details:</h3>
          <ul>
            <li><strong>Owner Name:</strong> ${formData.owner_name}</li>
            <li><strong>Email:</strong> ${formData.email}</li>
            <li><strong>Phone:</strong> ${formData.phone || 'Not provided'}</li>
            <li><strong>Horse Name:</strong> ${formData.horse_name}</li>
            <li><strong>Horse Breed:</strong> ${formData.horse_breed || 'Not provided'}</li>
            <li><strong>Horse Age:</strong> ${formData.horse_age || 'Not provided'}</li>
            <li><strong>Boarding Type:</strong> ${formData.boarding_type}</li>
            <li><strong>Start Date:</strong> ${formData.start_date || 'Not specified'}</li>
            <li><strong>Special Needs:</strong> ${formData.special_needs || 'None'}</li>
            <li><strong>Message:</strong> ${formData.message || 'None'}</li>
          </ul>
          <p>Please review and contact the potential member.</p>
        </div>
      `;

      await Promise.all([
        SendEmail({
          to: formData.email,
          subject: `Your Paddock & Paddle Equestrian Inquiry`,
          body: customerEmailBody,
          from_name: "Paddock & Paddle"
        }),
        SendEmail({
          to: "boarding@paddockandpaddle.com", // Your business email
          subject: `New Boarding Inquiry from ${formData.owner_name} for ${formData.horse_name}`,
          body: adminEmailBody,
          from_name: "Paddock & Paddle Website"
        })
      ]);

      setIsSuccess(true);
    } catch (error)
    {
      console.error("Error submitting inquiry:", error);
      // Optionally handle error display here
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-ranch-red">Inquiry Submitted!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in our equestrian services! We'll review your inquiry 
              and contact you within 48 hours to discuss availability and schedule a tour.
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSubmitting ? (
          <LoadingAnimation text="Submitting your inquiry..." />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-ranch-charcoal">
                <Heart className="w-5 h-5 text-ranch-red" />
                Equestrian Boarding Inquiry
              </DialogTitle>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ranch-charcoal">Owner Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Owner Name *</Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => handleInputChange('owner_name', e.target.value)}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(614) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ranch-charcoal">Horse Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horse_name">Horse Name *</Label>
                    <Input
                      id="horse_name"
                      value={formData.horse_name}
                      onChange={(e) => handleInputChange('horse_name', e.target.value)}
                      required
                      placeholder="Your horse's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horse_breed">Breed</Label>
                    <Input
                      id="horse_breed"
                      value={formData.horse_breed}
                      onChange={(e) => handleInputChange('horse_breed', e.target.value)}
                      placeholder="Quarter Horse, Arabian, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horse_age">Age (years)</Label>
                  <Input
                    id="horse_age"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.horse_age}
                    onChange={(e) => handleInputChange('horse_age', e.target.value)}
                    placeholder="Horse's age"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ranch-charcoal">Boarding Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="boarding_type">Boarding Type *</Label>
                    <Select
                      value={formData.boarding_type}
                      onValueChange={(value) => handleInputChange('boarding_type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select boarding type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self_boarding">Self Boarding - $600/month</SelectItem>
                        <SelectItem value="full_boarding">Full Boarding - $2000/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Desired Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_needs">Special Care Requirements</Label>
                <Textarea
                  id="special_needs"
                  value={formData.special_needs}
                  onChange={(e) => handleInputChange('special_needs', e.target.value)}
                  placeholder="Dietary restrictions, medications, behavioral notes, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Any questions or additional information you'd like to share..."
                  rows={4}
                />
              </div>

              <div className="bg-ranch-cream p-4 rounded-lg">
                <h4 className="font-semibold text-ranch-charcoal mb-2">What Happens Next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We'll review your inquiry and check availability</li>
                  <li>• Schedule a tour to meet our team and see our facilities</li>
                  <li>• Discuss your horse's specific needs and care plan</li>
                  <li>• Complete boarding agreement and arrange move-in</li>
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
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
