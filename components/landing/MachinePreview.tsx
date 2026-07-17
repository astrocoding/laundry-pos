import { cn } from "@/lib/cn";
import { machineStatuses } from "@/constants/landing";
import { Server } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-700 border-green-200";
    case "running":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "queued":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "maintenance":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "running":
      return "bg-sky-500 animate-pulse";
    case "queued":
      return "bg-amber-500";
    case "maintenance":
      return "bg-slate-500";
    default:
      return "bg-gray-500";
  }
};

export function MachinePreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mx-auto max-w-2xl">
      {machineStatuses.map((machine, idx) => (
        <div
          key={idx}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 bg-white/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md",
            getStatusColor(machine.status)
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 opacity-70" />
              <span className="font-bold text-lg">{machine.code}</span>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50 border border-black/5 shadow-sm">
              {machine.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full shadow-sm", getStatusDotColor(machine.status))} />
            <span className="text-sm font-medium capitalize">{machine.label}</span>
          </div>

          {(machine.timer || machine.queue) && (
            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold">
              {machine.timer && (
                <span>Time left: {machine.timer}</span>
              )}
              {machine.queue && (
                <span>Wait: {machine.queue} persons</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
