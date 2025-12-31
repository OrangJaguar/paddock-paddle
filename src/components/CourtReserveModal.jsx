import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, X } from "lucide-react";

export default function CourtReserveModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-center text-ranch-charcoal text-2xl">
            Book Your Court
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="pt-3 pb-6 space-y-3">
          <p className="text-center text-gray-600 px-2 leading-relaxed">
            We use <strong>Court Reserve</strong> to handle all booking and payments. 
            Click below to log in or create your account to reserve courts.
          </p>
          
          <a
            href="https://app.courtreserve.com/Account/Register?isMobileLayout=True&t=2&orgId=17183"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              className="w-full ranch-gradient text-white"
            >
              Login / Sign Up
            </Button>
          </a>
          
          <div className="bg-ranch-cream p-4 rounded-lg">
            <p className="text-sm text-gray-700 text-center mb-3">
              Need assistance? Contact us:
            </p>
            
            <div className="flex flex-col gap-2">
              <a 
                href="tel:+16144954995" 
                className="flex items-center justify-center gap-2 text-ranch-red hover:underline text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>(614) 495-4995</span>
              </a>
              
              <a 
                href="mailto:info@paddockandpaddle.com" 
                className="flex items-center justify-center gap-2 text-ranch-red hover:underline text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>info@paddockandpaddle.com</span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}