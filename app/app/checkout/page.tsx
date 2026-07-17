import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ machineId?: string }>;
}) {
  await requireUser();
  const { machineId } = await searchParams;

  if (!machineId) {
    redirect("/app/machines");
  }

  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
  });

  if (!machine || machine.status !== "AVAILABLE") {
    redirect("/app/machines");
  }

  const pricingRules = await prisma.pricingRule.findMany({
    where: { machineType: machine.type, isActive: true },
    orderBy: { price: "asc" },
  });


  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-6">
        Checkout
      </h1>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Machine Details</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Machine Code</dt>
              <dd className="mt-1 text-sm text-gray-900 font-semibold">{machine.code}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{machine.type}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm text-gray-900">{machine.capacityKg} kg</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{machine.status}</dd>
            </div>
          </dl>
        </div>
      </div>

      <CheckoutClient 
        machineId={machine.id} 
        pricingRules={pricingRules.map(pr => ({
          ...pr,
          price: pr.price.toNumber()
        }))} 
      />
    </div>
  );
}
