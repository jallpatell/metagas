"use client";
import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#141414] text-white">
      <div className="flex flex-col items-center justify-center">
        {/* GIF Animation */}
        <img 
          src="/assets/server.gif" 
          alt="Server loading animation" 
          className="w-108 h-108 mb-28"
        />

        {/* Floating Loading Text */}
        <div className="text-2xl font-extrabold font-mono text-center text-white animate-float">
          Spinning up a new SERVER <br /> Please Wait
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
