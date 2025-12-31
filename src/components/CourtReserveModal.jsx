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
        <DialogHeader>
          <DialogTitle className="text-center text-ranch-charcoal text-2xl">
            Booking System Update
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <p className="text-center text-gray-600">
            We're currently in the process of switching to <strong>Court Reserve</strong> to handle all booking and payment processing.
          </p>
          
          <div className="bg-ranch-cream p-4 rounded-lg space-y-3">
            <p className="text-sm text-gray-700 text-center">
              If you need assistance with booking, please reach out to us:
            </p>
            
            <div className="flex flex-col gap-2">
              <a 
                href="tel:+16144954995" 
                className="flex items-center justify-center gap-2 text-ranch-red hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>(614) 495-4995</span>
              </a>
              
              <a 
                href="mailto:info@paddockandpaddle.com" 
                className="flex items-center justify-center gap-2 text-ranch-red hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>info@paddockandpaddle.com</span>
              </a>
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full ranch-gradient text-white"
          >
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}