"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Droplets } from "lucide-react";


export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { name: "Features", href: "#features" },
    { name: "Workflow", href: "#workflow" },
    { name: "Roles", href: "#roles" },
    { name: "Pricing", href: "#pricing" },
    { name: "Security", href: "#security" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1 items-center gap-2">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="sr-only">LaundryPOS</span>
            <Droplets className="h-8 w-8 text-sky-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-600">
              LaundryPOS
            </span>
          </Link>
        </div>
        <div className="relative flex lg:hidden items-center" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors border-2 ${
              mobileMenuOpen
                ? "border-sky-500 bg-sky-50 text-sky-600"
                : "border-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg border border-gray-100 focus:outline-none z-50 overflow-hidden flex flex-col py-2">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </a>
              ))}
              <div className="h-px bg-gray-100 my-1 mx-4"></div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors text-sky-600 hover:bg-sky-50"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {links.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-600 hover:text-sky-600 transition-colors">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-900 px-3 py-2 hover:text-sky-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

    </header>
  );
}
