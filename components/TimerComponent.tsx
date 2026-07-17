"use client";

import { useState, useEffect } from "react";

export default function TimerComponent({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const syncTime = async () => {
      try {
        const res = await fetch("/api/time");
        const data = await res.json();
        const serverTime = new Date(data.serverTime).getTime();
        const endTime = new Date(endsAt).getTime();
        
        const diff = Math.floor((endTime - serverTime) / 1000);
        
        if (diff <= 0) {
          setTimeLeft(0);
          setIsFinished(true);
        } else {
          setTimeLeft(diff);
          setIsFinished(false);
          
          interval = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(interval);
                setIsFinished(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch {
        console.error("Failed to sync server time");
      }
    };

    syncTime();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [endsAt]);

  if (timeLeft === null) return <span>Loading...</span>;
  if (isFinished) return <span className="text-green-600 font-bold">Finished</span>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono font-bold text-sky-600">
      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
