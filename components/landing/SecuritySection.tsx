import { Lock, Shield, FileCheck, CheckCircle } from "lucide-react";

export function SecuritySection() {
  const points = [
    { name: "Server-side timestamps", icon: ClockIcon },
    { name: "Transaction locking", icon: Lock },
    { name: "Role-based access", icon: Shield },
    { name: "Audit-ready tracking", icon: FileCheck },
    { name: "Secure wallet deduction", icon: CheckCircle },
    { name: "Invoice traceability", icon: CheckCircle },
  ];

  return (
    <section id="security" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Reliable and traceable
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              LaundryPOS keeps your transactions accurate and transparent without overcomplicating your daily operations.
            </p>
            <dl className="mt-10 max-w-xl space-y-4 text-base leading-7 text-gray-600 lg:max-w-none">
              {points.map((point) => (
                <div key={point.name} className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <point.icon className="absolute left-1 top-1 h-5 w-5 text-sky-500" aria-hidden="true" />
                  </dt>
                  <dd className="inline">{point.name}</dd>
                </div>
              ))}
            </dl>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-white border border-sky-100 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col space-y-4">
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-10 w-full bg-sky-50 rounded border border-sky-100 flex items-center px-4 gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-400" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                  </div>
                  <div className="h-10 w-full bg-sky-50 rounded border border-sky-100 flex items-center px-4 gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-400" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                  <div className="h-10 w-full bg-sky-50 rounded border border-sky-100 flex items-center px-4 gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-400" />
                    <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
