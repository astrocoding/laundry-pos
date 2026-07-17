"use client";

import React, { useState } from "react";
import { Edit2, X } from "lucide-react";
import { updatePricingRule } from "./actions";

type PricingRule = {
  id: string;
  name: string;
  serviceType: string;
  machineType: string;
  durationMinutes: number;
  priceNum: number;
  isActive: boolean;
};

export default function EditPricingModal({ rule }: { rule: PricingRule }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await updatePricingRule(formData);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sky-600 hover:text-sky-900 flex items-center font-medium"
      >
        <Edit2 className="h-4 w-4 mr-1" />
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Pricing Record</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto px-6 py-4 text-left">
              <form id={`edit-pricing-form-${rule.id}`} onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="id" value={rule.id} />
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={rule.name}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    name="serviceType"
                    id="serviceType"
                    defaultValue={rule.serviceType}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border px-3 py-2"
                  >
                    <option value="WASH">Wash</option>
                    <option value="DRY">Dry</option>
                    <option value="WASH_DRY">Wash & Dry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="machineType" className="block text-sm font-medium text-gray-700 mb-1">
                    Machine Type
                  </label>
                  <select
                    name="machineType"
                    id="machineType"
                    defaultValue={rule.machineType}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border px-3 py-2"
                  >
                    <option value="WASHER">Washer</option>
                    <option value="DRYER">Dryer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    id="durationMinutes"
                    defaultValue={rule.durationMinutes}
                    required
                    min="1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Rp)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    defaultValue={rule.priceNum}
                    required
                    min="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="isActive"
                    id="isActive"
                    defaultValue={rule.isActive ? "true" : "false"}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border px-3 py-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={`edit-pricing-form-${rule.id}`}
                disabled={isLoading}
                className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
