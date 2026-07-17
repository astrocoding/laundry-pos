import Link from "next/link";
import { Droplets } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-sky-100">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Droplets className="h-6 w-6 text-sky-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-600">
              LaundryPOS
            </span>
          </Link>
          <p className="text-center text-sm leading-5 text-gray-500 max-w-md">
            The complete timer-based POS for modern self-service laundry operations.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>Built with Next.js</span>
            <span>&bull;</span>
            <span>React</span>
            <span>&bull;</span>
            <span>TailwindCSS</span>
          </div>
        </div>
        <p className="mt-8 text-center text-xs leading-5 text-gray-400">
          &copy; {new Date().getFullYear()} LaundryPOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
