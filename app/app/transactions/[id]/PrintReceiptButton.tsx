"use client";

import { Printer } from "lucide-react";
import { useState } from "react";

export default function PrintReceiptButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePrint = () => {
    setLoading(true);
    const printWindow = window.open(
      `/api/invoice/${orderId}/receipt`,
      "_blank",
      "width=400,height=700,scrollbars=yes"
    );

    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for this site to print the receipt.");
      setLoading(false);
      return;
    }

    // Reset loading after window opens
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      <Printer className="h-4 w-4" />
      {loading ? "Opening..." : "Print Receipt"}
    </button>
  );
}
