import { ShoppingBag, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboardMode } from '../context/DashboardModeContext';

export default function DashboardToggle({ size = 'md' }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const { isSellerMode, setIsSellerMode } = useDashboardMode();
  const checked = isSellerMode;
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
  const trackSize = size === 'sm' ? 'w-10 h-6' : 'w-14 h-8';
  const thumbSize = size === 'sm' ? 'w-4 h-4 left-1 top-1' : 'w-6 h-6 left-1 top-1';
  const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-6';

  const handleToggle = async (newChecked) => {
    if (newChecked) {
      // Only store the path if not on dashboard/shopregistration/home and not already set
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const lastBuyerPath = sessionStorage.getItem('lastBuyerPath');
        if (
          !lastBuyerPath &&
          !currentPath.startsWith('/dashboard') &&
          !currentPath.startsWith('/shopregistration') &&
          currentPath !== '/'
        ) {
          sessionStorage.setItem('lastBuyerPath', currentPath);
          console.log('Stored lastBuyerPath:', currentPath);
        }
      }
      setIsChecking(true);
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          router.push('/login');
          return;
        }
        // Decode token to get user_id
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid token format');
          return;
        }
        const payload = JSON.parse(atob(tokenParts[1]));
        const user_id = payload.id;

        console.log('Token user_id:', user_id);
        const apiUrl = `http://localhost:5000/api/seller/create-store/check/${user_id}`;
        console.log('API URL:', apiUrl);
        // Check if user has a store
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Check store response status:', response.status);
        const data = await response.json();
        console.log('Check store response data:', data);

        if (response.ok) {
          setIsSellerMode(true);
          setTimeout(() => router.push("/dashboard"), 350);
        } else {
          router.push('/shopregistration');
        }
      } catch (error) {
        console.error('Error checking store status:', error);
      } finally {
        setIsChecking(false);
      }
    } else {
      setIsSellerMode(false);
      if (typeof window !== 'undefined') {
        const lastBuyerPath = sessionStorage.getItem('lastBuyerPath');
        console.log('Retrieved lastBuyerPath:', lastBuyerPath);
        if (lastBuyerPath) {
          setTimeout(() => {
            router.push(lastBuyerPath);
            sessionStorage.removeItem('lastBuyerPath');
          }, 300);
          return;
        }
      }
      setTimeout(() => router.push("/"), 300);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className={`${iconSize} transition-colors duration-300 ${!checked ? 'text-red-600 drop-shadow-[0_2px_8px_rgba(255,0,0,0.25)]' : 'text-gray-400'}`} />
      <button
        type="button"
        aria-label="Toggle dashboard view"
        disabled={isChecking}
        className={`relative ${trackSize} rounded-full transition focus:outline-none shadow-lg border
          ${checked
            ? 'bg-gradient-to-r from-blue-600 to-teal-500 border-blue-400'
            : 'bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-md border-white/20'}
          ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => handleToggle(!checked)}
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