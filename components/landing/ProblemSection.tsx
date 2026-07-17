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
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {problems.map((problem, idx) => (
              <div key={idx} className="relative pl-12">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
                  </div>
                  Common issue
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{problem}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
