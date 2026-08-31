"use client";

const particles = [
  ["8%", "18%", "0s"],
  ["18%", "72%", "1s"],
  ["28%", "32%", "2s"],
  ["42%", "82%", "0.5s"],
  ["57%", "15%", "3s"],
  ["68%", "70%", "1.5s"],
  ["79%", "30%", "2.5s"],
  ["91%", "78%", "4s"],
  ["12%", "45%", "3s"],
  ["50%", "55%", "2s"],
];

const stars = [
  ["5%", "10%"],
  ["14%", "40%"],
  ["23%", "15%"],
  ["34%", "65%"],
  ["47%", "22%"],
  ["61%", "78%"],
  ["72%", "12%"],
  ["84%", "44%"],
  ["94%", "18%"],
  ["76%", "88%"],
];

export default function GenesisBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        {/* Main glow */}
        <div className="absolute left-1/2 top-[40%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[140px] animate-pulse" />

        {/* Secondary glows */}
        <div className="absolute -left-40 top-1/3 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px] animate-genesis-float" />

        <div className="absolute -right-40 top-1/2 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[130px] animate-genesis-float-reverse" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(circle at center, black 10%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 10%, transparent 75%)",
          }}
        />

        {/* Stars */}
        {stars.map(([left, top], index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-white animate-genesis-twinkle"
            style={{
              left,
              top,
              animationDelay: `${index * 0.35}s`,
            }}
          />
        ))}

        {/* Floating particles */}
        {particles.map(([left, top, delay], index) => (
          <span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-purple-300/70 shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-genesis-particle"
            style={{
              left,
              top,
              animationDelay: delay,
            }}
          />
        ))}

        {/* ================= ORBITS ================= */}

        <div className="absolute left-1/2 top-[40%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 sm:h-[900px] sm:w-[900px]">
          {/* Orbit 1 */}
          <div className="absolute inset-0 rounded-full border border-purple-500/10 animate-genesis-spin" />

          {/* Orbit 2 */}
          <div className="absolute inset-[10%] rounded-full border border-purple-400/15 animate-genesis-spin-reverse" />

          {/* Orbit 3 */}
          <div className="absolute inset-[20%] rounded-full border border-blue-400/10 animate-genesis-spin-fast" />

          {/* Orbit 4 */}
          <div className="absolute inset-[30%] rounded-full border border-fuchsia-400/10 animate-genesis-spin-reverse-fast" />

          {/* Orbiting particles */}
          <div className="absolute inset-0 animate-genesis-spin">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-purple-400 shadow-[0_0_25px_rgba(168,85,247,1)]" />
          </div>

          <div className="absolute inset-[10%] animate-genesis-spin-reverse">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_25px_rgba(59,130,246,1)]" />
          </div>

          <div className="absolute inset-[20%] animate-genesis-spin-fast">
            <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,1)]" />
          </div>
        </div>

        {/* Pulse rings */}
        <div className="absolute left-1/2 top-[40%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10 animate-genesis-ring" />

        <div
          className="absolute left-1/2 top-[40%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10 animate-genesis-ring"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <style jsx global>{`
        @keyframes genesisSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes genesisSpinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes genesisFloat {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(70px, -50px);
          }
        }

        @keyframes genesisFloatReverse {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-70px, 60px);
          }
        }

        @keyframes genesisTwinkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.7);
          }

          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes genesisParticle {
          0%,
          100% {
            opacity: 0.2;
            transform: translateY(0) scale(0.8);
          }

          50% {
            opacity: 1;
            transform: translateY(-35px) scale(1.3);
          }
        }

        @keyframes genesisRing {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.6);
          }

          40% {
            opacity: 0.5;
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        .animate-genesis-spin {
          animation: genesisSpin 35s linear infinite;
        }

        .animate-genesis-spin-reverse {
          animation: genesisSpinReverse 25s linear infinite;
        }

        .animate-genesis-spin-fast {
          animation: genesisSpin 18s linear infinite;
        }

        .animate-genesis-spin-reverse-fast {
          animation: genesisSpinReverse 14s linear infinite;
        }

        .animate-genesis-float {
          animation: genesisFloat 10s ease-in-out infinite;
        }

        .animate-genesis-float-reverse {
          animation: genesisFloatReverse 12s ease-in-out infinite;
        }

        .animate-genesis-twinkle {
          animation: genesisTwinkle 3s ease-in-out infinite;
        }

        .animate-genesis-particle {
          animation: genesisParticle 8s ease-in-out infinite;
        }

        .animate-genesis-ring {
          animation: genesisRing 4s ease-out infinite;
        }
      `}</style>
    </>
  );
}