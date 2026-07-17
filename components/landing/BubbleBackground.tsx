export function BubbleBackground() {
  const bubbles = Array.from({ length: 15 });

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {bubbles.map((_, i) => {
        // Pseudo-random deterministic values based on index
        const size = 20 + (i * 17) % 60;
        const left = (i * 23) % 100;
        const animationDelay = (i * 1.5) % 8;
        const animationDuration = 10 + (i * 2) % 10;
        const opacity = 0.1 + ((i * 3) % 4) * 0.1;

        return (
          <div
            key={i}
            className="absolute bottom-[-100px] rounded-full bg-gradient-to-tr from-sky-200 to-white/50 backdrop-blur-sm animate-bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              opacity: opacity,
              animationDelay: `${animationDelay}s`,
              animationDuration: `${animationDuration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
