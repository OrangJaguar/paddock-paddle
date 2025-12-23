import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Instagram,
  MessageSquare,
  CheckCircle } from
"lucide-react";
import LoadingAnimation from "../components/ui/LoadingAnimation";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiry_type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.ContactMessage.create(formData);

      // Send confirmation email to customer
      const customerEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank you for contacting us, ${formData.name}!</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <hr>
          <h3>Your Message:</h3>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message}</p>
          <hr>
          <p>If you need immediate assistance, please call us at (614) 123-4567.</p>
          <p>Best,<br>The Paddock & Paddle Team</p>
        </div>
      `;

      // Send notification email to business
      const adminEmailBody = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>
          <p>A new message has been submitted through the website contact form.</p>
          <hr>
          <h3>Contact Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${formData.name}</li>
            <li><strong>Email:</strong> ${formData.email}</li>
            <li><strong>Inquiry Type:</strong> ${formData.inquiry_type}</li>
            <li><strong>Subject:</strong> ${formData.subject}</li>
          </ul>
          <h3>Message:</h3>
          <p>${formData.message}</p>
          <hr>
          <p>Please respond to this inquiry within 24 hours.</p>
        </div>
      `;

      await Promise.all([
      base44.integrations.Core.SendEmail({
        to: formData.email,
        subject: `We received your message - Paddock & Paddle`,
        body: customerEmailBody,
        from_name: "Paddock & Paddle"
      }),
      base44.integrations.Core.SendEmail({
        to: "info@paddockandpaddle.com",
        subject: `New Contact Form: ${formData.subject}`,
        body: adminEmailBody,
        from_name: "Paddock & Paddle Website"
      })]
      );

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiry_type: "general"
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}>

          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-ranch-red">Touch</span>
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We'd love to hear from you! Whether you're interested in our luxury indoor pickleball courts,
            premium horse boarding, or exclusive events, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-ranch-charcoal mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Reach out to us through any of these methods, or stop by the club -
                  we're always happy to welcome visitors and answer your questions.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ranch-charcoal mb-2">Visit Us</h3>
                        <p className="text-gray-600">
                          8220 Dublin Road<br />
                          Dublin, OH 43017<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ranch-charcoal mb-2">Call Us</h3>
                        <p className="text-gray-600">
                          Main: (614) 123-4567<br />
                          Equestrian Center: (614) 123-4568
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ranch-charcoal mb-2">Email Us</h3>
                        <p className="text-gray-600">General: info@paddockandpaddle.com



                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ranch-charcoal mb-2">Club Hours</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
                          <p>Saturday - Sunday: 7:00 AM - 10:00 PM</p>
                          <p className="text-sm text-ranch-red">Equestrian care available 24/7</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-ranch-charcoal mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/paddockandpaddle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-200">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61583481638835"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-200">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-ranch-red rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-200">
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-ranch-charcoal">
                    Send Us a Message
                  </CardTitle>
                  <p className="text-gray-600">
                    We'll get back to you within 24 hours
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {isSuccess ?
                  <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-ranch-charcoal mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We'll respond to your inquiry within 24 hours.
                      </p>
                      <Button
                      onClick={() => setIsSuccess(false)}
                      className="ranch-gradient text-white">

                        Send Another Message
                      </Button>
                    </div> :
                  isSubmitting ?
                  <LoadingAnimation text="Sending your message..." /> :

                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          placeholder="Your full name" />

                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          placeholder="your@email.com" />

                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inquiry_type">Inquiry Type</Label>
                        <Select
                        value={formData.inquiry_type}
                        onValueChange={(value) => handleInputChange('inquiry_type', value)}>

                          <SelectTrigger>
                            <SelectValue placeholder="What can we help you with?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Information</SelectItem>
                            <SelectItem value="pickleball">Pickleball Courts</SelectItem>
                            <SelectItem value="boarding">Horse Boarding</SelectItem>
                            <SelectItem value="events">Events & Weddings</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        placeholder="Brief description of your inquiry" />

                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        placeholder="Tell us more about how we can help you..."
                        rows={6} />

                      </div>

                      <Button
                      type="submit"
                      className="w-full ranch-gradient text-white text-lg py-3"
                      disabled={isSubmitting}>

                        {isSubmitting ?
                      "Sending Message..." :

                      <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                      }
                      </Button>
                    </form>
                  }
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-ranch-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Find Us
            </h2>
            <p className="text-xl text-gray-600">
              Conveniently located in Dublin with easy access from I-270
            </p>
          </div>

          <Card className="shadow-2xl overflow-hidden">
            <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="max-w-md">
                  8220 Dublin Road, Dublin, OH 43017<br />
                  Get directions and explore our location
                </p>
                <a
                  href="https://www.google.com/maps/dir//8220+Dublin+Road+Dublin+OH+43017"
                  target="_blank"
                  rel="noopener noreferrer">

                  <Button className="mt-4 ranch-gradient text-white">
                    View on Google Maps
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-ranch-charcoal mb-6">
              Directions to Paddock & Paddle
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="font-semibold text-ranch-charcoal mb-3">From Downtown Columbus</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Take I-670 W to I-270 N</li>
                  <li>• Follow I-270 N to Exit 17A for OH-161/US-33 E</li>
                  <li>• Merge onto US-33 E/Dublin Rd</li>
                  <li>• Our entrance will be on the right in 2 miles</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="font-semibold text-ranch-charcoal mb-3">From the North (I-71)</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Take I-71 S to I-270 W</li>
                  <li>• Follow I-270 W to Exit 17 for US-33 E</li>
                  <li>• Keep left at the fork to continue on US-33 E</li>
                  <li>• Our entrance will be on the right in 2 miles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);

}