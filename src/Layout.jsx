import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourtReserveModal from "@/components/CourtReserveModal";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCourtReserveModal, setShowCourtReserveModal] = useState(false);

  // SEO: Update page title and meta tags based on current page
  useEffect(() => {
    const pageTitles = {
      'Homepage': 'Paddock & Paddle - Premier Pickleball & Horse Boarding Club in Dublin, Ohio',
      'About': 'About Paddock & Paddle - Dublin Ohio Luxury Club | Pickleball & Equestrian',
      'Services': 'Indoor Pickleball Courts & Horse Boarding Services - Paddock & Paddle Dublin',
      'Contact': 'Contact Paddock & Paddle - Dublin Ohio | Pickleball & Horse Boarding',
      'Profile': 'My Account - Paddock & Paddle',
      'PaymentSuccess': 'Payment Successful - Welcome to Paddock & Paddle',
      'PaymentCancelled': 'Payment Cancelled - Paddock & Paddle'
    };

    const pageDescriptions = {
      'Homepage': 'Paddock & Paddle is Dublin Ohio\'s premier luxury club featuring 5 indoor pickleball courts and premium horse boarding facilities. Join our exclusive community today!',
      'About': 'Learn about Paddock & Paddle, Dublin\'s most exclusive recreational destination combining world-class indoor pickleball with premium equestrian care since 2025.',
      'Services': 'Book indoor pickleball courts or inquire about full-service horse boarding at Paddock & Paddle. Monthly memberships available with unlimited court access.',
      'Contact': 'Contact Paddock & Paddle in Dublin, Ohio. Visit us at 5678 Dublin Rd or call (614) 123-4567 for pickleball court reservations and horse boarding inquiries.'
    };

    document.title = pageTitles[currentPageName] || 'Paddock & Paddle - Dublin Ohio';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageDescriptions[currentPageName] || 'Premier indoor pickleball courts and luxury horse boarding in Dublin, Ohio. Join Paddock & Paddle today!';

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = 'paddock and paddle, pickleball dublin ohio, indoor pickleball courts, horse boarding dublin, equestrian club ohio, pickleball membership, luxury horse boarding, dublin ohio recreation, paddock paddle';

    // Add Open Graph tags
    const ogTags = {
      'og:title': pageTitles[currentPageName] || 'Paddock & Paddle',
      'og:description': pageDescriptions[currentPageName] || 'Premier indoor pickleball and horse boarding in Dublin, Ohio',
      'og:type': 'website',
      'og:url': window.location.href,
      'og:site_name': 'Paddock & Paddle'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

  }, [currentPageName, location.pathname]);



  const navigationItems = [
  { name: "Home", path: createPageUrl("Homepage") },
  { name: "About", path: createPageUrl("About") },
  { name: "Services", path: createPageUrl("Services") },
  { name: "Contact", path: createPageUrl("Contact") }];


  return (
    <div className="min-h-screen bg-white text-ranch-charcoal">
      {/* SEO: Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          "name": "Paddock & Paddle",
          "description": "Premier indoor pickleball courts and luxury horse boarding facility in Dublin, Ohio",
          "url": "https://paddockandpaddle.com",
          "logo": "https://paddockandpaddle.com/logo.png",
          "image": "https://paddockandpaddle.com/og-image.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "8220 Dublin Rd",
            "addressLocality": "Delaware",
            "addressRegion": "OH",
            "postalCode": "43015",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.0992",
            "longitude": "-83.1141"
          },
          "telephone": "+1-614-495-4995",
          "email": "info@paddockandpaddle.com",
          "priceRange": "$$-$$$",
          "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "06:00",
            "closes": "22:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday", "Sunday"],
            "opens": "07:00",
            "closes": "22:00"
          }],

          "sameAs": [
          "https://www.facebook.com/profile.php?id=61583481638835",
          "https://www.instagram.com/paddockandpaddle"],

          "hasMap": "https://maps.google.com/?q=8220+Dublin+Rd+Delaware+OH+43015",
          "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "Indoor Pickleball Courts",
            "value": "5 courts"
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Horse Boarding",
            "value": "10 stalls"
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Parking",
            "value": "Free parking available"
          }]

        })}
      </script>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --radius: 1rem;

          --ranch-red: #C41E3A;
          --ranch-cream: #F7F3E9;
          --ranch-sage: #9CAF88;
          --ranch-charcoal: #2D2D2D;
        }

        body {
          font-family: 'Poppins', sans-serif;
        }
        
        .ranch-gradient {
          background: linear-gradient(135deg, var(--ranch-red) 0%, #A91A2E 100%);
        }
        
        .text-ranch-red { color: var(--ranch-red); }
        .bg-ranch-red { background-color: var(--ranch-red); }
        .bg-ranch-cream { background-color: var(--ranch-cream); }
        .text-ranch-sage { color: var(--ranch-sage); }
        .text-ranch-charcoal { color: var(--ranch-charcoal); }
        .border-ranch-red { border-color: var(--ranch-red); }
        
        .hero-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C41E3A' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      {/* Grand Opening Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 text-center">
        <p className="text-ranch-charcoal font-bold text-sm md:text-base">🎉 GRAND OPENING • JANUARY 4TH, 2025 @ 12 PM • JOIN US!

        </p>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm relative z-50">
        <div className="bg-ranch-red py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center md:justify-end items-center space-x-6 text-white text-sm">
              <a href="tel:+16144954995" className="flex items-center gap-1 hover:opacity-80">
                <Phone className="w-3 h-3" />
                <span>(614) 495-4995</span>
              </a>
              <a href="mailto:info@paddockandpaddle.com" className="flex items-center gap-1 hover:opacity-80">
                <Mail className="w-3 h-3" />
                <span>info@paddockandpaddle.com</span>
              </a>
            </div>
          </div>
        </div>
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
          <div className="flex justify-between items-center py-6">
            <Link to={createPageUrl("Homepage")} className="flex items-center" aria-label="Paddock & Paddle Home">
              <h1 className="text-3xl font-bold tracking-tight text-ranch-charcoal">
                Paddock<span className="text-ranch-red font-semibold">&Paddle</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) =>
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                location.pathname === item.path ?
                "text-ranch-red border-b-2 border-ranch-red pb-1" :
                "text-ranch-charcoal hover:text-ranch-red"}`
                }
                aria-current={location.pathname === item.path ? "page" : undefined}>

                  {item.name}
                </Link>
              )}
              <Button
                onClick={() => setShowCourtReserveModal(true)}
                className="ranch-gradient text-white hover:opacity-90 transition-opacity duration-200">

                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}>

              {mobileMenuOpen ?
              <X className="w-6 h-6 text-ranch-charcoal" /> :

              <Menu className="w-6 h-6 text-ranch-charcoal" />
              }
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen &&
        <div className="md:hidden bg-white border-t absolute w-full z-40">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) =>
            <Link
              key={item.name}
              to={item.path}
              className={`block py-2 font-medium transition-colors duration-200 ${
              location.pathname === item.path ?
              "text-ranch-red" :
              "text-ranch-charcoal hover:text-ranch-red"}`
              }
              onClick={() => setMobileMenuOpen(false)}>

                  {item.name}
                </Link>
            )}
              <Button
              onClick={() => {
                setShowCourtReserveModal(true);
                setMobileMenuOpen(false);
              }}
              className="ranch-gradient text-white w-full mt-4">

                Book Now
              </Button>
            </div>
          </div>
        }
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ranch-cream text-ranch-charcoal" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold tracking-tight mb-4">
                Paddock<span className="text-ranch-red font-semibold">&Paddle</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Dublin's premier luxury destination for equestrian excellence and world-class indoor pickleball. 
                Experience the perfect blend of tradition and modern sophistication.
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <address className="not-italic">8220 Dublin Rd, Delaware, OH 43015</address>
                </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to={createPageUrl("Services")} className="hover:text-ranch-red transition-colors">Indoor Pickleball Courts</Link></li>
                <li><Link to={createPageUrl("Services")} className="hover:text-ranch-red transition-colors">Premium Horse Boarding</Link></li>
                <li><Link to={createPageUrl("Contact")} className="hover:text-ranch-red transition-colors">Private Events</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to={createPageUrl("About")} className="hover:text-ranch-red transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl("Contact")} className="hover:text-ranch-red transition-colors">Contact</Link></li>
                <li><a href="https://www.instagram.com/paddockandpaddle" target="_blank" rel="noopener noreferrer" className="hover:text-ranch-red transition-colors">Follow Us on Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p className="text-sm">© 2025 Paddock & Paddle. All rights reserved. | Indoor Pickleball Courts & Horse Boarding in Delaware, Ohio</p>
            <p className="text-xs mt-2 text-gray-400">Website Crafted by Sanskar and Shubham</p>
          </div>
        </div>
      </footer>

      {/* Court Reserve Modal */}
      <CourtReserveModal
        isOpen={showCourtReserveModal}
        onClose={() => setShowCourtReserveModal(false)} />

    </div>);

}