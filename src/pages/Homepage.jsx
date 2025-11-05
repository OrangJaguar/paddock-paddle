import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart, Users, Star, MapPin } from "lucide-react";

export default function Homepage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/9087e434a_photo-1642104798671-01a4129f4fdc1.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-white mb-6 text-5xl font-bold tracking-tight leading-tight md:text-7xl">
            Welcome to Paddock & Paddle
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Dublin's premier luxury club featuring world-class indoor pickleball courts and 
            exceptional equestrian facilities in the heart of Ohio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Services")}>
              <Button
                size="lg"
                className="ranch-gradient text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity duration-300 w-full sm:w-auto shadow-lg"
              >
                Reserve Pickleball Court
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("Services")}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-ranch-charcoal px-8 py-4 text-lg font-semibold transition-all duration-300 w-full sm:w-auto shadow-lg"
              >
                Horse Boarding Info
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-ranch-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-ranch-charcoal mb-6">
              Your Exclusive Getaway Awaits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              From morning rides to evening matches, Paddock & Paddle offers an unparalleled luxury club experience 
              with state-of-the-art indoor facilities and premium amenities in beautiful Dublin, Ohio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://www.worldwidesteelbuildings.com/wp-content/uploads/2023/06/06.png"
                alt="Indoor pickleball courts at Paddock & Paddle"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-ranch-charcoal mb-6">
                World-Class Indoor Pickleball Courts
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Experience the ultimate in indoor pickleball luxury with our climate-controlled, professionally 
                maintained courts. Whether you're a beginner or tournament player, our pristine facilities 
                provide the perfect environment for year-round play.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-ranch-red" />
                  <span>Climate-controlled indoor courts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-ranch-red" />
                  <span>Tournament-grade professional surfaces</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-ranch-red" />
                  <span>Premium equipment and pro shop</span>
                </li>
              </ul>
              <Link to={createPageUrl("Services")}>
                <Button className="ranch-gradient text-white">
                  Book Your Court
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            <div className="md:order-2">
              <img
                src="https://images.unsplash.com/photo-1553284966-19b8815c7817?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Premium horse boarding at Paddock & Paddle"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="md:order-1">
              <h3 className="text-3xl font-bold text-ranch-charcoal mb-6">
                Premium Horse Boarding
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Your horses deserve the finest care in an exclusive, professional environment. 
                Our experienced staff provides personalized attention while your 
                horses enjoy spacious pastures and exceptional facilities.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-ranch-red" />
                  <span className="text-lg">24/7 professional horse care</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-ranch-red" />
                  <span className="text-lg">Luxurious stalls and lush pastures</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-ranch-red" />
                  <span className="text-lg">Premium riding arenas and trails</span>
                </li>
              </ul>
              <Link to={createPageUrl("Services")}>
                <Button className="ranch-gradient text-white">
                  Learn About Boarding
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 ranch-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">Acres of Greenery</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-lg opacity-90">Indoor Pickleball Courts</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10</div>
              <div className="text-lg opacity-90">Horse Stalls</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ranch-cream">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-ranch-charcoal mb-6">
            Ready to Experience Paddock & Paddle?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join our exclusive community of pickleball enthusiasts and equestrian lovers. Reserve your visit today 
            and discover why Paddock & Paddle is Dublin's premier luxury destination.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Services")}>
              <Button
                size="lg"
                className="ranch-gradient text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity duration-300 w-full sm:w-auto"
              >
                Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-ranch-red text-ranch-red hover:bg-ranch-red hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}