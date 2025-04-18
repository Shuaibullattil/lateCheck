"use client";

import React from "react";
import { MapPin, LockOpen, Lock, Phone, ChevronRight } from "lucide-react";
import Location from "./Locations";
 

const Abouthostel = ({ hostel }: { hostel: string }) => {
  const capitalizedHostel = hostel.charAt(0).toUpperCase() + hostel.slice(1);
  const wardenPhone = "+919876543210";
  const messSecretaryPhone = "+919876543211";

  return (
    <div className="w-full max-w-4xl mx-auto bg-green-50 border border-green-300 rounded-2xl shadow-md p-5 space-y-4 transition-all duration-300 text-sm">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-green-900">{capitalizedHostel}</h2>
        <div className="flex items-center gap-1 text-green-700">
          <MapPin className="h-4 w-4 text-green-600" />
          <span>CUSAT, Kalamassery</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Timings */}
        <div className="flex flex-col gap-2 p-6 bg-white rounded-xl border border-green-200 shadow-sm md:col-span-1">
          <div className="flex items-center gap-2">
            <LockOpen className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-green-800">Opens</span>
              <span className="text-xs text-gray-600">06:00 AM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-red-500" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-red-700">Closes</span>
              <span className="text-xs text-gray-600">11:00 PM</span>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="flex flex-col p-2 bg-white rounded-xl border border-green-200 md:col-span-2">
          {[
            { role: "Warden", phone: wardenPhone },
            { role: "Mess Secretary", phone: messSecretaryPhone },
            { role: "Asst. Mess Secretary", phone: messSecretaryPhone },
          ].map(({ role, phone }, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-2 py-2 rounded hover:bg-green-100 transition"
            >
              <div className="flex items-center gap-2 text-green-800 font-medium text-xs">
                <ChevronRight className="h-3 w-3 text-green-500" />
                <span>{role}</span>
              </div>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition"
              >
                <Phone className="h-4 w-4 text-white" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-green-300">
        <Location hostelName={hostel} />
      </div>
    </div>
  );
};

export default Abouthostel;
