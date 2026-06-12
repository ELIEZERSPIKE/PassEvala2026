interface SponsorStatusBadgeProps {
  isActive: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

export default function SponsorStatusBadge({ isActive, onToggle, disabled }: SponsorStatusBadgeProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        isActive 
          ? "bg-green-50 text-green-700 hover:bg-green-100" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      ].join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-green-600" : "bg-gray-400"].join(" ")} />
      {isActive ? "Actif" : "Inactif"}
    </button>
  );
}