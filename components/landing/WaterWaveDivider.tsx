export function WaterWaveDivider({ className }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${className || ""}`}>
      <svg
        className="block w-full h-[60px] sm:h-[80px] lg:h-[120px]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
