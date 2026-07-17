import { workflowSteps } from "@/constants/landing";

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-sky-600">How it works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple self-service flow
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A frictionless transaction journey from digital top-up to printed invoice.
          </p>
        </div>

        <div className="mx-auto max-w-4xl relative">
          {/* Vertical line connecting steps on large screens */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-sky-100 -translate-x-1/2" />
          
          <div className="space-y-12">
            {workflowSteps.map((step, index) => (
              <div key={step.step} className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Step circle */}
                <div className="absolute md:static left-0 top-0 md:transform-none -translate-x-1/2 md:translate-x-0 w-12 h-12 rounded-full bg-white border-4 border-sky-100 flex items-center justify-center font-bold text-sky-600 shadow-sm z-10 shrink-0">
                  {step.step}
                </div>
                
                {/* Content */}
                <div className={`ml-16 md:ml-0 flex-1 bg-sky-50/50 rounded-2xl p-6 border border-sky-100 shadow-sm transition-all hover:shadow-md hover:bg-white ${index % 2 === 0 ? 'md:text-right' : 'md:order-last'}`}>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.desc}</p>
                </div>
                
                {/* Spacer for alternating layout on desktop */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
