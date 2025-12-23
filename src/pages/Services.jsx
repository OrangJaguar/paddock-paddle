import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Star,
  Users,
  Heart,
  Shield,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  CheckCircle
} from "lucide-react";
import PicleballBookingForm from "../components/services/PicleballBookingForm";
import BoardingInquiryForm from "../components/services/BoardingInquiryForm";

const faqs = [
  {
    category: "Pickleball",
    questions: [
      {
        q: "What are your pickleball court hours?",
        a: "Our courts are open daily from 6:00 AM to 10:00 PM. We offer both indoor and outdoor courts to accommodate all weather conditions."
      },
      {
        q: "Do you provide equipment rentals?",
        a: "Yes! We offer high-quality paddle and ball rentals for our members. We also have a pro shop with equipment for purchase."
      },
      {
        q: "Can I book courts in advance?",
        a: "Absolutely! We recommend booking 1-2 weeks in advance, especially for weekends and peak hours. You can book online or call us directly."
      }
    ]
  },
  {
    category: "Horse Boarding",
    questions: [
      {
        q: "What boarding options do you offer?",
        a: "We offer pasture boarding, individual stalls, and premium stalls with runs. All options include daily feeding, turnout, and basic care."
      },
      {
        q: "What veterinary services are available?",
        a: "We work with local veterinarians for routine and emergency care. We can coordinate all veterinary appointments and follow specific care instructions."
      },
      {
        q: "Can I visit my horse anytime?",
        a: "Yes! Members have 24/7 access to visit their horses. We just ask that you check in at the main office during business hours for your first few visits."
      },
      {
        q: "Do you provide feed or do I need to supply my own?",
        a: "We provide high-quality hay and grain as part of our boarding fee. If your horse has special dietary needs, we can accommodate custom feeding programs."
      }
    ]
  },
  {
    category: "General",
    questions: [
      {
        q: "Is there parking available?",
        a: "Yes, we have ample free parking for all members and guests."
      },
      {
        q: "Do you host private events?",
        a: "Absolutely! Our club is perfect for corporate retreats, family reunions, and special celebrations. Contact us to discuss your event needs."
      },
      {
        q: "Are there trails for riding?",
        a: "Yes, we maintain miles of scenic riding trails that wind through our property and connect to local park systems."
      }
    ]
  }
];

export default function Services() {
  const [activeBookingForm, setActiveBookingForm] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/4e164a391_photo-1693142517898-2f986215e4121.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-white text-xl max-w-3xl mx-auto mb-10">
            Experience the perfect blend of luxury recreational excellence and premium equestrian care 
            at Dublin's most exclusive country club.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="ranch-gradient text-white px-8 py-4"
              onClick={() => setActiveBookingForm('pickleball')}
            >
              Book Pickleball Court
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-ranch-red px-8 py-4"
              onClick={() => setActiveBookingForm('boarding')}
            >
              Inquire About Boarding
            </Button>
          </div>
        </div>
      </section>

      {/* Pickleball Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Indoor Pickleball Courts
            </h2>
            <p className="text-xl text-gray-600">
              Five championship indoor courts featuring climate control and professional maintenance
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/541ebe8b6_ScreenShot2025-12-13at44505PM.png"
                alt="Luxury indoor pickleball courts at Paddock & Paddle"
                className="rounded-2xl shadow-2xl mb-8"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-ranch-cream rounded-xl">
                  <Users className="w-8 h-8 text-ranch-red mx-auto mb-3" />
                  <div className="text-2xl font-bold text-ranch-charcoal">5</div>
                  <div className="text-sm text-gray-600">Indoor Courts</div>
                </div>
                <div className="text-center p-6 bg-ranch-cream rounded-xl">
                  <Clock className="w-8 h-8 text-ranch-red mx-auto mb-3" />
                  <div className="text-2xl font-bold text-ranch-charcoal">10</div>
                  <div className="text-sm text-gray-600">Hours Daily</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-ranch-charcoal mb-6">
                Luxury Indoor Playing Experience
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ranch-red mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ranch-charcoal mb-2">Climate-Controlled Comfort</h4>
                    <p className="text-gray-600">Year-round indoor play with perfect temperature and humidity control for optimal performance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ranch-red mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ranch-charcoal mb-2">Professional Tournament Surfaces</h4>
                    <p className="text-gray-600">Premium acrylic surfaces professionally maintained daily for consistent, superior ball bounce</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ranch-red mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ranch-charcoal mb-2">State-of-the-Art Lighting</h4>
                    <p className="text-gray-600">LED court lighting provides optimal visibility without glare for precision play</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ranch-red mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ranch-charcoal mb-2">Premium Amenities</h4>
                    <p className="text-gray-600">Luxury locker rooms, pro shop, and comfortable viewing areas for family and friends</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h4 className="font-semibold text-ranch-charcoal text-xl mb-4">Membership Options</h4>
                
                {/* First 50 Members Special */}
                <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-amber-500 text-white">First 50 Members!</Badge>
                        </div>
                        <h5 className="font-bold text-ranch-charcoal mb-1">Initial 50 Members</h5>
                        <p className="text-sm text-gray-600 mb-3">No initiation fee • Reserve 1 month ahead</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Membership:</span>
                            <span className="font-semibold">$12/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Court Rental:</span>
                            <span className="font-semibold">$36/hr ($9/person)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">2-Hour Rate:</span>
                            <span className="font-semibold">$72</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Open Play:</span>
                            <span className="font-semibold">$9 for 90 mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Regular Members */}
                <Card className="border-2 border-ranch-red">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-bold text-ranch-charcoal mb-1">Members</h5>
                        <p className="text-sm text-gray-600 mb-3">$49 initiation fee • 2 weeks advance booking</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Membership:</span>
                            <span className="font-semibold">$18/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Court Rental:</span>
                            <span className="font-semibold">$40/hr ($10/person)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Open Play:</span>
                            <span className="font-semibold">$10 for 90 mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Family Add-ons */}
                <Card className="border border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-bold text-ranch-charcoal mb-1">Family Add-ons</h5>
                        <p className="text-sm text-gray-600 mb-3">Not for initial members • 2 weeks advance booking</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Membership:</span>
                            <span className="font-semibold">$15/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Court Rental:</span>
                            <span className="font-semibold">$40/hr ($10/person)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Open Play:</span>
                            <span className="font-semibold">$10 for 90 mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pay to Play */}
                <Card className="border border-gray-300 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-bold text-ranch-charcoal mb-1">Pay to Play</h5>
                        <p className="text-sm text-gray-600 mb-3">No membership required • 2 days advance booking</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Court Rental:</span>
                            <span className="font-semibold">$52/hr ($13/person)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Open Play:</span>
                            <span className="font-semibold">$15 for 90 mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="ranch-gradient text-white px-10 py-4"
              onClick={() => setActiveBookingForm('pickleball')}
            >
              Reserve Your Court Now
            </Button>
          </div>
        </div>
      </section>

      {/* Horse Boarding Services */}
      <section className="py-20 bg-ranch-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Equestrian Services
            </h2>
            <p className="text-xl text-gray-600">
              Premium care for your horses in an exclusive, professional setting
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-ranch-sage">
              <h3 className="text-3xl font-bold text-ranch-charcoal mb-4">
                Coming Soon
              </h3>
              <p className="text-5xl font-bold text-ranch-red mb-6">
                Summer 2026
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We're excited to announce that our premium equestrian boarding services will be launching in Summer 2026. 
                Stay tuned for world-class horse care facilities featuring spacious stalls, professional staff, 
                and exceptional amenities for both you and your horses.
              </p>
              <Button
                size="lg"
                className="ranch-gradient text-white px-10 py-4"
                onClick={() => setActiveBookingForm('boarding')}
              >
                Join the Waitlist
              </Button>
            </div>

            <div className="mt-12">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/e47148228_ScreenShot2025-12-13at44513PM.png"
                alt="Horse stalls at Paddock & Paddle"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our services
            </p>
          </div>

          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="text-2xl font-bold text-ranch-charcoal mb-6 text-center">
                {category.category} Questions
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const globalIndex = categoryIndex * 10 + index;
                  return (
                    <Card key={index} className="shadow-md">
                      <CardContent className="p-0">
                        <button
                          className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-ranch-red rounded-lg"
                          onClick={() => toggleFAQ(globalIndex)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold text-ranch-charcoal pr-4">
                              {faq.q}
                            </h4>
                            {expandedFAQ === globalIndex ? (
                              <ChevronUp className="w-5 h-5 text-ranch-red flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-ranch-red flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        
                        {expandedFAQ === globalIndex && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Forms */}
      {activeBookingForm === 'pickleball' && (
        <PicleballBookingForm onClose={() => setActiveBookingForm(null)} />
      )}
      
      {activeBookingForm === 'boarding' && (
        <BoardingInquiryForm onClose={() => setActiveBookingForm(null)} />
      )}
    </div>
  );
}