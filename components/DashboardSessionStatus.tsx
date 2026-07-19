"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatTime } from "@/lib/format";

export default function DashboardSessionStatus({ 
  initialStatus, 
  endsAt 
}: { 
  initialStatus: string; 
  endsAt: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (status !== "RUNNING") return;

    const checkStatus = () => {
      const endTime = new Date(endsAt).getTime();
      const now = new Date().getTime();
      if (now >= endTime) {
        setStatus("COMPLETED");
        router.refresh();
      }
    };

    // Check immediately, then every 10 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, [status, endsAt, router]);

  const endsAtDate = new Date(endsAt);
  
  if (status === "RUNNING") {
    return (
      <span className="text-gray-500 pr-10">
        Running until {formatTime(endsAtDate)}
      </span>
    );
  }

  return (
    <span className="text-gray-500 pr-10">
      Finished at {formatTime(endsAtDate)}
    </span>
  );
}
