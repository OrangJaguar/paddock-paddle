import React from "react";

export default function LoadingAnimation({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-20 h-20 mb-4">
        {/* Pickleball */}
        <div className="pickleball-bounce absolute inset-0 flex items-center justify-center">
          <div className="relative w-16 h-16 bg-yellow-400 rounded-full shadow-lg">
            {/* Pickleball holes pattern */}
            <div className="absolute top-2 left-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-2 right-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-6 left-2 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-6 right-2 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-2 left-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-2 right-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Shadow */}
        <div className="shadow-bounce absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gray-300 rounded-full opacity-30"></div>
      </div>
      
      {text && (
        <p className="text-ranch-charcoal font-medium animate-pulse">{text}</p>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes shadowPulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(-50%) scale(0.7);
            opacity: 0.15;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .pickleball-bounce {
          animation: bounce 1s ease-in-out infinite, spin 2s linear infinite;
        }

        .shadow-bounce {
          animation: shadowPulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}