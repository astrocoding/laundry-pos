import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-sky-500/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Start building a cleaner laundry transaction flow.
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Simplify your self-service laundry operations today with LaundryPOS.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition-all flex items-center justify-center gap-2"
          >
            Try demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-semibold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Login dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
