import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight, Mail } from "lucide-react";

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ranch-cream flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-ranch-charcoal mb-2">
            Payment Cancelled
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Your membership signup was not completed
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No charges were made to your account. You can try again whenever you're ready.
            </p>
          </div>

          <div className="bg-ranch-cream p-6 rounded-lg">
            <h3 className="font-semibold text-ranch-charcoal mb-4 text-lg">
              What would you like to do?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ranch-red rounded-full mt-2 flex-shrink-0"></div>
                <span>Try the signup process again</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ranch-red rounded-full mt-2 flex-shrink-0"></div>
                <span>Learn more about our services and amenities</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ranch-red rounded-full mt-2 flex-shrink-0"></div>
                <span>Contact us if you have questions</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate(createPageUrl("Homepage"))}
              className="flex-1 ranch-gradient text-white"
            >
              Try Signup Again
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate(createPageUrl("Services"))}
              variant="outline"
              className="flex-1"
            >
              View Services
            </Button>
          </div>

          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Need help?</span>
            </div>
            <p className="text-sm text-gray-500">
              Contact us at{" "}
              <a href="mailto:info@paddockandpaddle.com" className="text-ranch-red underline">
                info@paddockandpaddle.com
              </a>
              {" "}or call{" "}
              <a href="tel:6141234567" className="text-ranch-red underline">
                (614) 123-4567
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}