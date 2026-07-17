import Link from "next/link";
import { BubbleBackground } from "./BubbleBackground";
import { MachinePreview } from "./MachinePreview";
import { ArrowRight, LogIn } from "lucide-react";

export function LandingHero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-sky-50 to-white min-h-[90vh] flex flex-col justify-center">
      <BubbleBackground />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Timer-based Laundry POS for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500">
              self-service
            </span>{" "}
            transactions
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Manage washer and dryer availability, customer top-ups, queue flow, invoices, and operational monitoring from one responsive web dashboard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition-all flex items-center justify-center gap-2"
            >
              Start transaction <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-semibold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> View dashboard
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="relative rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl p-6 lg:p-8 overflow-hidden isolate ring-1 ring-black/5">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-white/20 -z-10" />
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sky-100/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Live Monitor Preview</div>
            </div>
            
            <MachinePreview />
            
          </div>
        </div>
      </div>
    </div>
  );
}
