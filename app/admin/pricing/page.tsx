import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import PricingTable, { PricingRuleData } from "./PricingTable";

export default async function AdminPricingPage() {
  await requireAdmin();

  const pricingRules = await prisma.pricingRule.findMany({
    orderBy: [{ machineType: 'asc' }, { durationMinutes: 'asc' }],
  });

  const serializedRules: PricingRuleData[] = pricingRules.map((r) => ({
    id: r.id,
    name: r.name,
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
            A list of all pricing rules for machines.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <PricingTable rules={serializedRules} />
      </div>
    </div>
  );
}
