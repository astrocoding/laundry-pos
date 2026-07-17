import { roles } from "@/constants/landing";
import { CheckCircle2 } from "lucide-react";

export function RoleSection() {
  return (
    <section id="roles" className="py-24 bg-sky-50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tailored for every role
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Secure and scoped access specifically designed for customers, staff, and business owners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div key={role.title} className="bg-white rounded-2xl p-8 shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                {role.title}
              </h3>
              <ul className="space-y-4">
                {role.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
