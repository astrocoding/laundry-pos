import {
  Clock,
  Settings2,
  Wallet,
  Activity,
  ListOrdered,
  Receipt,
  ShieldCheck,
  BarChart4,
  Cpu,
} from "lucide-react";

export type MachineStatusPreview = {
  code: string;
  type: string;
  status: "available" | "running" | "queued" | "maintenance";
  label: string;
  timer?: string;
  queue?: number;
};

export const machineStatuses: MachineStatusPreview[] = [
  {
    code: "W1",
    type: "Washer",
    status: "available",
    label: "Available",
  },
  {
    code: "W2",
    type: "Washer",
    status: "running",
    label: "Running",
    timer: "25 min",
  },
  {
    code: "D1",
    type: "Dryer",
    status: "queued",
    label: "Queued",
    queue: 2,
  },
  {
    code: "D2",
    type: "Dryer",
    status: "maintenance",
    label: "Maintenance",
  },
];

export const features = [
  {
    title: "Timer-Based Booking",
    description: "Purchase precise operational time for washers and dryers.",
    icon: Clock,
  },
  {
    title: "Dynamic Pricing",
    description: "Adjust rates easily for peak hours, holidays, or machine types.",
    icon: Settings2,
  },
  {
    title: "Customer Wallet",
    description: "Seamless top-ups and balance management for regular customers.",
    icon: Wallet,
  },
  {
    title: "Live Monitoring",
    description: "View availability and running timers in real-time.",
    icon: Activity,
  },
  {
    title: "Queue Control",
    description: "Keep waiting lists organized without manual tracking.",
    icon: ListOrdered,
  },
  {
    title: "Digital Invoices",
    description: "Traceable, printable, and secure receipts for every wash.",
    icon: Receipt,
  },
  {
    title: "Role-Based Access",
    description: "Secure separation between user, admin, and owner.",
    icon: ShieldCheck,
  },
  {
    title: "Owner Reporting",
    description: "Monitor branch performance and revenue dynamically.",
    icon: BarChart4,
  },
  {
    title: "Future IoT Ready",
    description: "Built with extension points prepared for direct hardware links.",
    icon: Cpu,
  },
] as const;

export const workflowSteps = [
  { step: 1, title: "Register or login", desc: "Create an account in seconds." },
  { step: 2, title: "Top up wallet", desc: "Add balance securely." },
  { step: 3, title: "Choose machine", desc: "Select any available washer or dryer." },
  { step: 4, title: "Select package", desc: "Choose your preferred time package." },
  { step: 5, title: "Confirm payment", desc: "Deducts directly from wallet." },
  { step: 6, title: "Timer starts", desc: "Machine is reserved and runs." },
  { step: 7, title: "Receive invoice", desc: "Get a digital receipt automatically." },
] as const;

export const roles = [
  {
    title: "User",
    features: [
      "Top up balance",
      "Select machine",
      "Buy timer",
      "View transaction history",
      "Download or print receipt",
    ],
  },
  {
    title: "Admin",
    features: [
      "Manage machines",
      "Manage pricing",
      "Monitor queue",
      "View transactions",
      "Handle maintenance status",
    ],
  },
  {
    title: "Owner",
    features: [
      "View revenue report",
      "Monitor branch performance",
      "Review machine utilization",
      "Manage admin access",
      "Audit transaction data",
    ],
  },
] as const;

export const pricingPlans = [
  {
    name: "Washer Standard",
    time: "30 minutes",
    price: "Rp 15.000",
    features: ["Standard washing cycle", "Real-time timer tracking", "Auto-lock reservation"],
  },
  {
    name: "Dryer Quick",
    time: "15 minutes",
    price: "Rp 10.000",
    features: ["High-heat drying", "Queue priority display", "Instant notification"],
  },
  {
    name: "Custom Pricing",
    time: "Flexible",
    price: "Configurable",
    features: ["Set by branch admin", "Holiday rate adjustments", "Promotional discounts"],
  },
] as const;
