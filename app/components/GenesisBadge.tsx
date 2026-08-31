export default function GenesisBadge() {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-emerald-500/20
        bg-emerald-500/[0.07]
        px-3.5
        py-2
        shadow-[0_0_30px_rgba(16,185,129,0.06)]
      "
    >
      <span
        className="
          flex
          h-2
          w-2
          rounded-full
          bg-emerald-400
          shadow-[0_0_10px_rgba(52,211,153,0.8)]
        "
      />

      <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
        Genesis Cycle
      </span>

      <span className="text-zinc-600">•</span>

      <span className="text-xs font-medium text-zinc-500">
        Aug 17 — Aug 30
      </span>
    </div>
  );
}