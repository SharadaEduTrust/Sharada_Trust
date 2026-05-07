import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Image,
  Calendar,
  MessageSquare,
  Layers,
  Handshake,
  Smartphone,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Home,
  Monitor, // Added Monitor
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TeamManagement from "./dashboardComponents/TeamManagement";
import BlogManagement from "./dashboardComponents/BlogManagement";
import EducationImages from "./dashboardComponents/EducationImageManagement";
import EventManagement from "./dashboardComponents/EventManagement";
import TestimonialsManagement from "./dashboardComponents/TestimonialDashboard/TestimonialManagment";
import ProgramManagement from "./dashboardComponents/ProgramManagement";
import PartnerManagement from "./dashboardComponents/PartnerManagement";
import SulabhManagement from "./dashboardComponents/SulabhManagement";
import HeroImageManagement from "./dashboardComponents/HeroImageManagement";
import HomeManagement from "./dashboardComponents/HomeManagement";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("adminActiveTab") || "members");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const navItems = [
    { id: "home-management", label: "Home Page", icon: Home },
    { id: "members", label: "Team Management", icon: Users },
    { id: "blogs", label: "Blog Management", icon: BookOpen },
    { id: "education-images", label: "Education Images", icon: Image },
    { id: "events", label: "Events", icon: Calendar },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "programs", label: "Programs", icon: Layers },
    { id: "partners", label: "Partners", icon: Handshake },
    { id: "sulabh", label: "Sulabh App", icon: Smartphone },
    { id: "hero-images", label: "Hero Images", icon: Monitor }, // Added Item
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "members":
        return <TeamManagement />;
      case "blogs":
        return <BlogManagement />;
      case "education-images":
        return <EducationImages />;
      case "events":
        return <EventManagement />;
      case "testimonials":
        return <TestimonialsManagement />;
      case "programs":
        return <ProgramManagement />;
      case "partners":
        return <PartnerManagement />;
      case "sulabh":
        return <SulabhManagement />;
      case "hero-images":
        return <HeroImageManagement />;
      case "home-management":
        return <HomeManagement />;
      default:
        return <TeamManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out h-full
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 py-2 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  localStorage.setItem("adminActiveTab", item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer
                  ${isActive ? "bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-100" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                `}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-gray-400"}`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2 shrink-0 bg-white">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout Account
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-1.5 rounded-md">
              <LayoutDashboard className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-bold text-gray-800">Admin Dashboard</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 mt-1">
                Manage your website content and settings.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
