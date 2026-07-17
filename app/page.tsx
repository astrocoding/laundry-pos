import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { RoleSection } from "@/components/landing/RoleSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { CtaSection } from "@/components/landing/CtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WaterWaveDivider } from "@/components/landing/WaterWaveDivider";

export const metadata: Metadata = {
  title: "LaundryPOS | Timer-Based Laundry POS System",
  description:
    "LaundryPOS helps laundry businesses manage timer-based machine transactions, queue flow, top-ups, invoices, and operational monitoring.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-sky-200 selection:text-sky-900">
      <LandingNavbar />
      <main>
        <LandingHero />
        <WaterWaveDivider className="text-white bg-gradient-to-b from-sky-50 to-white" />
        <ProblemSection />
        <FeatureSection />
        <WorkflowSection />
        <RoleSection />
        <SecuritySection />
        <PricingPreview />
        <WaterWaveDivider className="text-white rotate-180 -scale-x-100 bg-sky-50" />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
