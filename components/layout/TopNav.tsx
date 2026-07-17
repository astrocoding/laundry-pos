"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Server, 
  CircleDollarSign, 
  Activity, 
  FileText,
  Moon,
  User,
  LogOut,
  Layers,
  Menu,
  X
} from "lucide-react";

export function TopNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    const timer = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (status === "loading") {
    return <nav className="bg-white shadow-sm border-b border-gray-200 h-16 sticky top-0 z-50 w-full" />;
  }

  if (!session) return null;

  const role = session.user?.role as string;
  const userName = session.user?.name || "User";
  const userEmail = session.user?.email || "user@example.com";

  const getLinks = () => {
    if (role === "OWNER") {
      return [
        { name: "Dashboard", href: "/owner", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
        { name: "Users", href: "/owner/users", icon: <Users className="w-4 h-4 mr-2" /> },
        { name: "Pricing", href: "/owner/pricing", icon: <CircleDollarSign className="w-4 h-4 mr-2" /> },
      ];
    }
    if (role === "ADMIN") {
      return [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
        { name: "Machines", href: "/admin/machines", icon: <Server className="w-4 h-4 mr-2" /> },
        { name: "Pricing", href: "/admin/pricing", icon: <CircleDollarSign className="w-4 h-4 mr-2" /> },
        { name: "Monitor", href: "/admin/monitoring", icon: <Activity className="w-4 h-4 mr-2" /> },
      ];
    }
    return [
      { name: "Home", href: "/app", icon: <Home className="w-4 h-4 mr-2" /> },
      { name: "Machines", href: "/app/machines", icon: <Server className="w-4 h-4 mr-2" /> },
      { name: "Transactions", href: "/app/transactions", icon: <FileText className="w-4 h-4 mr-2" /> },
      { name: "Monitor", href: "/app/monitor", icon: <Activity className="w-4 h-4 mr-2" /> },
    ];
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <svg className="absolute w-0 h-0">
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#60a5fa" offset="0%" />
          <stop stopColor="#2563eb" offset="100%" />
        </linearGradient>
      </svg>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center w-full">
          
          {/* Left Side: Logo & Links & Mobile Menu */}
          <div className="flex items-center h-full">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center mr-4">
              <div className="flex items-center mr-2">
                <Layers className="w-7 h-7" style={{ stroke: "url(#blue-gradient)" }} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-sky-800 tracking-tight hidden sm:block">
                LaundryPOS
              </span>
              <span className="ml-3 hidden sm:inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 border border-gray-200">
                {role.toLowerCase()}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <div className="relative sm:hidden flex items-center" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors border-2 ${
                  isMobileMenuOpen 
                    ? "border-sky-500 bg-sky-50 text-sky-600" 
                    : "border-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Mobile Dropdown */}
              {isMobileMenuOpen && (
                <div className="absolute left-0 top-12 mt-2 w-56 origin-top-left rounded-xl bg-white shadow-lg border border-gray-100 focus:outline-none z-50 overflow-hidden flex flex-col py-2">
                  <div className="px-4 py-2 border-b border-gray-50 mb-2">
                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-sky-800 tracking-tight">
                      LaundryPOS
                    </span>
                    <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-800 border border-gray-200">
                      {role.toLowerCase()}
                    </span>
                  </div>
                  {getLinks().map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sky-50/50 text-sky-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className={`mr-3 ${isActive ? "text-sky-600" : "text-gray-400"}`}>
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className="hidden sm:flex items-center">
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1 h-full items-center">
              {getLinks().map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side: Actions & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle (Placeholder) */}
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Moon className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center p-2 rounded-lg border transition-colors ${
                  isDropdownOpen ? "border-sky-500 bg-sky-50 text-sky-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-md border border-gray-100 focus:outline-none z-50 overflow-hidden">
                  <div className="px-4 py-4 bg-gray-50/50">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {userEmail}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-100 bg-white">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-500" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
