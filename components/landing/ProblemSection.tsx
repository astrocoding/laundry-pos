import { AlertCircle } from "lucide-react";

const problems = [
  "Customers ask staff which machine is available.",
  "Manual timer tracking causes mistakes.",
  "Queue order is unclear.",
  "Pricing changes are difficult to control.",
  "Reports and invoices are scattered.",
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Laundry operations can be chaotic
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Without a centralized timer and POS system, running a self-service laundry requires constant supervision and manual tracking.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-6 lg:max-w-none lg:grid-cols-3">
            {problems.map((problem, idx) => (
              <div key={idx} className="relative flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    Common issue
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-600">{problem}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
