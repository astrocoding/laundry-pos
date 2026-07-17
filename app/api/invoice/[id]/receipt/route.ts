import { NextResponse } from "next/server";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${d}/${m}/${y}`;
};

const formatDateTime = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${d}/${m}/${y} ${hh}:${mm}`;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      invoice: true,
      session: { include: { machine: true } },
      user: { select: { name: true, phone: true } },
    },
  });

  if (!order || !order.invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only allow cashier to view their own, admin/owner can view all
  if (order.userId !== user.id && user.role === "CASHIER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const inv = order.invoice;
  const endsAt = order.session?.endsAt;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=70mm">
  <title>Receipt - ${inv.invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: monospace;
      font-size: 12px;
      width: 70mm;
      max-width: 70mm;
      background: #404040;
    }
    .page {
      width: 70mm;
      max-width: 70mm;
      min-height: 147mm;
      background: white;
      margin: 0 auto;
    }
    .subpage { padding: 4mm 3mm; }
    .store-name { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
    .store-sub { font-size: 11px; color: #555; margin-bottom: 2px; }
    .divider { border: none; border-top: 1px dashed #333; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    td, th { vertical-align: top; }
    .label-col { width: 28%; color: #555; }
    .sep-col { width: 4%; }
    .val-col { width: 68%; }
    .items-head td { border-bottom: 1px dashed #333; font-weight: bold; padding: 4px 0; }
    .item-row td { padding: 3px 0; }
    .summary-row td { padding: 2px 0; }
    .total-row td { border-top: 1px dashed #333; padding-top: 5px; font-weight: bold; font-size: 13px; }
    .status-box { text-align: center; border: 2px solid #000; padding: 5px 0; margin: 10px 0 8px; border-radius: 3px; }
    .status-box strong { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; }
    .qr-wrap { text-align: center; margin: 8px 0 4px; }
    .qr-wrap img { width: 80px; height: 80px; }
    .qr-label { text-align: center; font-size: 10px; color: #555; margin-bottom: 8px; }
    .footer-note { font-size: 10px; text-align: center; color: #777; padding: 4px 0; border-top: 1px dashed #333; margin-top: 8px; }
    @page { size: 70mm auto; margin: 0; orientation: portrait; }
    @media print {
      html, body { background: white; }
      .page { border: none; box-shadow: none; min-height: initial; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="subpage">
    <div class="store-name">LaundryPOS</div>
    <div class="store-sub">Modern Laundry POS System</div>
    <hr class="divider" />

    <table>
      <tr>
        <td class="label-col">Receipt No.</td>
        <td class="sep-col">:</td>
        <td class="val-col"><strong>${inv.invoiceNumber}</strong></td>
      </tr>
      <tr>
        <td class="label-col">Date</td>
        <td class="sep-col">:</td>
        <td class="val-col">${formatDateTime(inv.issuedAt)}</td>
      </tr>
      <tr>
        <td class="label-col">Cashier</td>
        <td class="sep-col">:</td>
        <td class="val-col">${order.user.name}</td>
      </tr>
      <tr>
        <td class="label-col">Customer</td>
        <td class="sep-col">:</td>
        <td class="val-col">${inv.customerName}</td>
      </tr>
      <tr>
        <td class="label-col">Payment</td>
        <td class="sep-col">:</td>
        <td class="val-col">${inv.paymentMethod}</td>
      </tr>
    </table>

    <hr class="divider" />

    <table>
      <tr class="items-head">
        <td>Service / Machine</td>
        <td align="right">Price</td>
      </tr>
      <tr class="item-row">
        <td>
          ${inv.serviceName}<br/>
          <span style="font-size:11px;color:#555;">
            Machine: ${inv.machineCode} &bull; ${inv.durationMinutes} min
            ${endsAt ? `<br/>Finish: ${formatDate(endsAt)}` : ""}
          </span>
        </td>
        <td align="right">${formatCurrency(inv.subtotal.toNumber())}</td>
      </tr>
    </table>

    <hr class="divider" />

    <table>
      <tr class="summary-row">
        <td>Subtotal</td>
        <td align="right">${formatCurrency(inv.subtotal.toNumber())}</td>
      </tr>
      ${
        inv.discount.toNumber() > 0
          ? `<tr class="summary-row">
        <td>Discount</td>
        <td align="right" style="color:#c00;">- ${formatCurrency(inv.discount.toNumber())}</td>
      </tr>`
          : ""
      }
      <tr class="total-row">
        <td>TOTAL</td>
        <td align="right">${formatCurrency(inv.finalAmount.toNumber())}</td>
      </tr>
    </table>

    <div class="status-box">
      <strong>${inv.status}</strong>
    </div>

    <div class="qr-wrap">
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(inv.invoiceNumber)}&choe=UTF-8"
        alt="QR Code ${inv.invoiceNumber}"
      />
    </div>
    <div class="qr-label">Scan to verify this receipt</div>

    <div class="footer-note">
      Thank you for using LaundryPOS!<br/>
      Printed: ${formatDateTime(new Date())}
    </div>
  </div>
</div>
<script>
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.focus();
      window.print();
    }, 300);
  });
  window.addEventListener('afterprint', function() {
    setTimeout(function() { window.close(); }, 2 * 60 * 1000);
  });
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
