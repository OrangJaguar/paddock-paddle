import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, MapPin, Target, Shield, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section with Background */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/e9e12fadb_ScreenShot2025-12-13at44523PM.png')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-white mb-6 text-5xl font-bold md:text-6xl">
              Our Vision
            </h1>
            <p className="text-white text-xl font-light max-w-3xl mx-auto">
              A premier luxury club blending classic equestrian tradition with state-of-the-art indoor pickleball facilities, 
              right here in Dublin, Ohio.
            </p>
          </div>
        </div>
      </section>

      {/* Legacy Section with Image */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ranch-charcoal mb-6">
                A Legacy of Excellence, Reimagined
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Paddock & Paddle was founded with a vision to create Dublin's most exclusive recreational destination. 
                Combining timeless equestrian heritage with the excitement of modern indoor pickleball, 
                we've created a sanctuary where luxury meets athleticism.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Today, Paddock & Paddle stands as the premier choice for discerning members who demand 
                world-class facilities, exceptional service, and an atmosphere of refined sophistication.
              </p>
              <div className="flex items-center gap-3 text-ranch-red">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Dublin, Ohio • Established 2025</span>
              </div>
            </div>
            <div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/0ca984f67_ScreenShot2025-12-13at44453PM.png"
                alt="Luxury barn interior at Paddock & Paddle"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-ranch-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              To provide an unparalleled luxury club experience through premier equestrian care and world-class 
              indoor pickleball facilities, fostering an exclusive community in Dublin, Ohio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-ranch-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-ranch-red" />
                </div>
                <h3 className="text-xl font-bold text-ranch-charcoal mb-4">Equestrian Excellence</h3>
                <p className="text-gray-600">
                  Delivering unparalleled care, training, and premium facilities for horses and their owners, 
                  ensuring a luxurious and nurturing environment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-ranch-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-ranch-red" />
                </div>
                <h3 className="text-xl font-bold text-ranch-charcoal mb-4">Elite Community</h3>
                <p className="text-gray-600">
                  Creating an exclusive, welcoming atmosphere where distinguished members can connect, 
                  build friendships, and share their passions for sport and leisure.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-ranch-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-ranch-red" />
                </div>
                <h3 className="text-xl font-bold text-ranch-charcoal mb-4">Premium Facilities</h3>
                <p className="text-gray-600">
                  Maintaining our indoor courts, stables, and grounds to the highest luxury standards, 
                  ensuring an exceptional experience for all members and guests.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Estate Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ranch-charcoal mb-6">
              Our Estate
            </h2>
            <p className="text-xl text-gray-600">A luxury club built on 10+ acres of pristine Ohio landscape</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold text-ranch-charcoal mb-6">10+ Acres of Natural Splendor</h3>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ranch-red rounded-full mt-3 flex-shrink-0"></div>
                  <span>Breathtaking views of the Ohio countryside</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ranch-red rounded-full mt-3 flex-shrink-0"></div>
                  <span>Meticulously maintained pastures and mature woodlands</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ranch-red rounded-full mt-3 flex-shrink-0"></div>
                  <span>State-of-the-art climate-controlled facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ranch-red rounded-full mt-3 flex-shrink-0"></div>
                  <span>Miles of scenic riding trails through diverse terrain</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ranch-red rounded-full mt-3 flex-shrink-0"></div>
                  <span>Premium facilities maintained to luxury standards</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d354dbd88e97af4e6c67a5/671935bc0_ScreenShot2025-12-13at44445PM.png"
                alt="Horse stalls and barn facilities"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}