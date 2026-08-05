const GRADIENTS: Record<string, string> = {
  indigo: "from-indigo-500 via-violet-500 to-fuchsia-500",
  plum: "from-violet-600 via-purple-500 to-indigo-500",
  amber: "from-amber-400 via-orange-500 to-rose-500",
  default: "from-slate-500 via-slate-600 to-slate-700",
};

/** 프로토타입용 대표 이미지 자리 — 실제 서비스에서는 업로드 사진으로 대체 */
export default function Cover({
  preset = "default",
  label,
  className = "",
  rounded = "rounded-xl",
}: {
  preset?: string;
  label?: string;
  className?: string;
  rounded?: string;
}) {
  const g = GRADIENTS[preset] ?? GRADIENTS.default;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${g} ${rounded} ${className}`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
      {label && (
        <span className="relative z-10 px-4 text-center text-lg font-semibold text-white/95 drop-shadow">
          {label}
        </span>
      )}
    </div>
  );
}
