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
import CourtReserveModal from "../components/CourtReserveModal";

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
  const [showCourtReserveModal, setShowCourtReserveModal] = useState(false);
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
              onClick={() => setShowCourtReserveModal(true)}
            >
              Book Pickleball Court
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-ranch-red px-8 py-4"
              onClick={() => setShowCourtReserveModal(true)}
            >
              Inquire About Boarding
            </Button>
          </div>
        </div>
      </section>

      {/* Membership Options - NEW SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Membership Options
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Members */}
            <Card className="border-2 border-ranch-red shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-br from-red-50 to-white pb-4">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-ranch-charcoal mb-2">
                    Members
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-4">$49 initiation fee</p>
                  <div className="text-4xl font-bold text-ranch-red mb-1">$18</div>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Court Rental:</span>
                    <span className="font-bold">$40/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per Person:</span>
                    <span className="font-bold">$10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Open Play:</span>
                    <span className="font-bold">$5/90min</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Reserve 2 weeks ahead
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Family Add-ons */}
            <Card className="border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-white pb-4">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-ranch-charcoal mb-2">
                    Family Add-on
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-4">Not for initial members</p>
                  <div className="text-4xl font-bold text-ranch-red mb-1">$15</div>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Court Rental:</span>
                    <span className="font-bold">$40/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per Person:</span>
                    <span className="font-bold">$10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Open Play:</span>
                    <span className="font-bold">$5/90min</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Reserve 2 weeks ahead
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pay to Play */}
            <Card className="border-2 border-gray-400 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50">
              <CardHeader className="bg-gradient-to-br from-gray-100 to-gray-50 pb-4">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-ranch-charcoal mb-2">
                    Pay to Play
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-4">No membership</p>
                  <div className="text-4xl font-bold text-ranch-red mb-1">$0</div>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Court Rental:</span>
                    <span className="font-bold">$52/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per Person:</span>
                    <span className="font-bold">$13</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Open Play:</span>
                    <span className="font-bold">$15/90min</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Reserve 2 days ahead
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-6">
            <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-ranch-charcoal mb-2">
                ⚠️ Please Register Your Account Before Visiting
              </p>
              <p className="text-gray-700">
                All guests must create an account through Court Reserve before arriving at the facility. 
                This ensures a smooth check-in process and allows you to reserve courts in advance.
              </p>
            </div>

            <Button
              size="lg"
              className="ranch-gradient text-white px-10 py-4"
              onClick={() => setShowCourtReserveModal(true)}
            >
              Reserve Your Court Now
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              * Account required to reserve courts, even for pay-to-play
            </p>
          </div>
        </div>
      </section>

      {/* Pickleball Services */}
      <section className="py-20 bg-ranch-cream">
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


            </div>
          </div>

        </div>
      </section>

      {/* Horse Boarding Services */}
      <section className="py-20 bg-white">
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
                onClick={() => setShowCourtReserveModal(true)}
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

      {/* Court Reserve Modal */}
      <CourtReserveModal
        isOpen={showCourtReserveModal}
        onClose={() => setShowCourtReserveModal(false)}
      />
    </div>
  );
}