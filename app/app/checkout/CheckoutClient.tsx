"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface PricingRule {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export default function CheckoutClient({
  machineId,
  pricingRules,
}: {
  machineId: string;
  pricingRules: PricingRule[];
}) {
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    if (!selectedRuleId) return;
    const selectedRule = pricingRules.find((r) => r.id === selectedRuleId);
    if (!selectedRule) return;

    if (!customerName) {
      setError("Please enter customer name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const idempotencyKey = uuidv4();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId,
          pricingRuleId: selectedRuleId,
          idempotencyKey,
          customerName,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      router.push(`/app/monitor`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Checkout Service</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="CASH">Cash</option>
              <option value="QRIS">QRIS</option>
              <option value="TRANSFER">Transfer Bank</option>
              <option value="MIDTRANS">Midtrans</option>
            </select>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 mt-6 mb-2">Select Package</h4>
          {pricingRules.map((rule) => (
            <label
              key={rule.id}
              className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ${
                selectedRuleId === rule.id ? "border-sky-500 ring-2 ring-sky-500" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="pricingRule"
                value={rule.id}
                className="sr-only"
                checked={selectedRuleId === rule.id}
                onChange={(e) => setSelectedRuleId(e.target.value)}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900">{rule.name}</span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">
                    {rule.durationMinutes} Minutes
                  </span>
                </span>
              </span>
              <span className="mt-0 ml-4 flex flex-col text-right">
                <span className="text-sm font-medium text-gray-900">Rp {rule.price.toLocaleString("id-ID")}</span>
              </span>
            </label>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6">
          <button
            onClick={handleCheckout}
            disabled={!selectedRuleId || !customerName || loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay & Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
