import { ShoppingBag, LayoutDashboard } from "lucide-react";

export default function DashboardToggle({ checked, onToggle, size = 'md' }) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
  const trackSize = size === 'sm' ? 'w-10 h-6' : 'w-14 h-8';
  const thumbSize = size === 'sm' ? 'w-4 h-4 left-1 top-1' : 'w-6 h-6 left-1 top-1';
  const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-6';

  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className={`${iconSize} transition-colors duration-300 ${!checked ? 'text-red-600 drop-shadow-[0_2px_8px_rgba(255,0,0,0.25)]' : 'text-gray-400'}`} />
      <button
        type="button"
        aria-label="Toggle dashboard view"
        className={`relative ${trackSize} rounded-full transition focus:outline-none shadow-lg border
          ${checked
            ? 'bg-gradient-to-r from-blue-600 to-teal-500 border-blue-400'
            : 'bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-md border-white/20'}
        `}
        onClick={() => onToggle(!checked)}
      >
        <span
          className={`absolute ${thumbSize} rounded-full shadow-lg border transition-all duration-300
            ${checked ? `${thumbTranslate} bg-white/90 border-blue-500` : `bg-white/80 border-gray-300`}
          `}
        />
      </button>
      <LayoutDashboard className={`${iconSize} transition-colors duration-300 ${checked ? 'text-red-600 drop-shadow-[0_2px_8px_rgba(255,0,0,0.25)]' : 'text-gray-400'}`} />
    </div>
  );
} 