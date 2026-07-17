import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PrintReceiptButton from "./PrintReceiptButton";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { invoice: true },
  });
  const invoiceNumber = order?.invoice?.invoiceNumber ?? "Invoice";
  return { title: `Invoice ${invoiceNumber}` };
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { invoice: true },
  });

  if (!order) notFound();

  // Ensure users can only view their own invoices, unless they are admin/owner
  if (order.userId !== user.id && user.role === "CASHIER") {
    redirect("/app");
  }

  const invoice = order.invoice;
  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/app/transactions" className="text-sm font-medium text-sky-600 hover:text-sky-500">
          &larr; Back to Transactions
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Invoice</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{invoice.invoiceNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              {invoice.status}
            </span>
            <PrintReceiptButton orderId={order.id} />
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Billed to</p>
              <p className="mt-1 text-sm text-gray-900 font-semibold">{invoice.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1 text-sm text-gray-900">{invoice.createdAt.toLocaleDateString()} {invoice.createdAt.toLocaleTimeString()}</p>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200 border-t border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 text-sm text-gray-900">
                  <span className="font-medium">{invoice.serviceName}</span>
                  <br />
                  <span className="text-gray-500">Machine: {invoice.machineCode}</span>
                  <br />
                  <span className="text-gray-500">Duration: {invoice.durationMinutes} mins</span>
                </td>
                <td className="py-4 text-sm text-gray-900 text-right font-medium">
                  Rp {invoice.subtotal.toNumber().toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900 text-right">Subtotal</td>
                <td className="py-4 text-sm font-medium text-gray-900 text-right">Rp {invoice.subtotal.toNumber().toLocaleString("id-ID")}</td>
              </tr>
              {invoice.discount.toNumber() > 0 && (
                <tr>
                  <td className="py-2 text-sm font-medium text-gray-900 text-right">Discount</td>
                  <td className="py-2 text-sm font-medium text-red-600 text-right">- Rp {invoice.discount.toNumber().toLocaleString("id-ID")}</td>
                </tr>
              )}
              <tr>
                <td className="py-4 text-base font-bold text-gray-900 text-right border-t border-gray-200">Total</td>
                <td className="py-4 text-base font-bold text-gray-900 text-right border-t border-gray-200">Rp {invoice.finalAmount.toNumber().toLocaleString("id-ID")}</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between text-sm text-gray-500">
            <p>Payment Method: {invoice.paymentMethod}</p>
            <p>Thank you for using LaundryPOS!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
