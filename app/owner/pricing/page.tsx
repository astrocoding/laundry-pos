import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import PricingTable, { PricingRuleData } from "./PricingTable";
import AddPricingModal from "./AddPricingModal";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing Management" };

export const dynamic = "force-dynamic";

export default async function OwnerPricingPage() {
  await requireOwner();

  const pricingRules = await prisma.pricingRule.findMany({
    orderBy: [{ machineType: 'asc' }, { durationMinutes: 'asc' }],
  });

  const serializedRules: PricingRuleData[] = pricingRules.map((r) => ({
    id: r.id,
    name: r.name,
    serviceType: r.serviceType,
    machineType: r.machineType,
    durationMinutes: r.durationMinutes,
    priceNum: r.price.toNumber(),
    isActive: r.isActive,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Rules</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all pricing rules for machines. Create, update, or deactivate pricing settings.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <AddPricingModal />
        </div>
      </div>
      <div className="mt-8">
        <PricingTable rules={serializedRules} />
      </div>
    </div>
  );
}
