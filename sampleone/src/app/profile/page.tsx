"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Phone, Mail, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // Null initially

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/"); // or "/"
  };
  

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.replace("/"); // Redirect if not logged in
    }
  }, [router]);

  if (!user) return null; // Avoid rendering before user is ready

  return (
    <div className="flex flex-col  min-h-screen bg-[#f1fdf3]">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
          <button
            onClick={() => router.push("/home")}
            className="flex items-center gap-1 text-green-600 hover:text-green-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-green-700 font-semibold text-xl">Your Profile</div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-24" />

      {/* Main Content */}
      <main className="flex flex-col flex-1 px-4 sm:px-6 max-w-3xl w-full mx-auto pb-6">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-5 border border-green-300">
          <div className="flex flex-col items-center gap-3">
            <img
              src="https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-600 shadow object-cover"
            />
            <h2 className="text-2xl font-semibold text-green-900">{user.name} • {user.details.id}</h2>
            <button onClick={handleLogout} className="bg-red-200 px-3 py-2 rounded-lg border border-red-300 text-md flex gap-2 mb-1 text-red-700 font-semibold">Logout <LogOut className="text-red-700 h-4 w-4 mt-1 font-bold"/></button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Hostel" value={user.details.hostel} />
            <InfoCard label="Room No." value={user.details.room_no} />
            <InfoCard label="Branch" value={user.details.branch} />
            <InfoCard label="Semester" value={user.details.sem} />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactCard icon={<Phone className="h-4 w-4 text-green-600" />} label="Phone" value={user.details.phone_no} />
            <ContactCard icon={<Mail className="h-4 w-4 text-green-600" />} label="Email" value={user.details.email} />
          </div>
        </div>
      </main>
            <footer className=" fixed bottom-0 left-0 w-full p-3 z-50">
              <div className="flex justify-center">
                <MenuButton />
              </div>
            </footer>
    </div>
  );
};

// Reusable components
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col p-4 bg-[#f1fdf3] rounded-lg border border-green-200">
    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
      <User className="h-4 w-4 text-green-600" />
      {label}
    </div>
    <p className="text-xs text-gray-700 mt-1">{value}</p>
  </div>
);

const ContactCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col p-4 bg-[#f1fdf3] rounded-lg border border-green-200">
    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
      {icon}
      {label}
    </div>
    <p className="text-xs text-gray-700 mt-1">{value}</p>
  </div>
);

export default ProfilePage;
