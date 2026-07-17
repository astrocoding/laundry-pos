"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

    let interval: NodeJS.Timeout;

    const checkStatus = () => {
      const endTime = new Date(endsAt).getTime();
      const now = new Date().getTime();
      
      if (now >= endTime) {
        setStatus("COMPLETED");
        router.refresh();
      }
    };

    // Check immediately and then every 10 seconds
    checkStatus();
    interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, [status, endsAt, router]);

  const endsAtDate = new Date(endsAt);
  
  if (status === "RUNNING") {
    return (
      <span className="text-gray-500 pr-10">
        Running until {endsAtDate.toLocaleTimeString()}
      </span>
    );
  }

  return (
    <span className="text-gray-500 pr-10">
      Finished at {endsAtDate.toLocaleTimeString()}
    </span>
  );
}
