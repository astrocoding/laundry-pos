import { pricingPlans } from "@/constants/landing";
import { Check } from "lucide-react";

export function PricingPreview() {
  return (
    <section id="pricing" className="py-24 bg-sky-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-b from-white/0 via-white/50 to-white/0 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl sm:text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dynamic and configurable
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Admins and owners can freely configure pricing packages directly from the dashboard. Here are some examples of what you can set up.
          </p>
        </div>
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-sky-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              {/* Subtle glass accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-500">/ {plan.time}</span>
                </p>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-sky-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
