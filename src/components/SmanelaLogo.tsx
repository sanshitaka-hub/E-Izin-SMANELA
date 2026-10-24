import React from 'react';

interface SmanelaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const SmanelaLogo: React.FC<SmanelaLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false 
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const baseUrl = (import.meta.env.BASE_URL || './').replace(/\/+$/, '');
  const primaryLogo = `${baseUrl}/logo-smanela-transparent.png`;
  const fallbackLogo = `${baseUrl}/assets/aistudio/LOGO_SMANELA_transparent.png`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Kotak / Square Emblem Container - Bersih tanpa background hitam */}
      <div 
        className={`relative ${sizeMap[size]} aspect-square shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105`}
        title="Logo Resmi SMAN 1 Lawang"
      >
        <img
          src={primaryLogo}
          alt="Logo Resmi SMAN 1 Lawang (SMANELA)"
          className="w-full h-full object-contain drop-shadow-md"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.indexOf('LOGO_SMANELA_transparent.png') === -1) {
              target.src = fallbackLogo;
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-sm sm:text-base leading-tight tracking-tight text-white drop-shadow-xs">
            SMAN 1 LAWANG
          </span>
          <span className="text-[10px] sm:text-xs text-amber-300 font-extrabold tracking-widest uppercase">
            BAKTIKU HARAPANMU
          </span>
        </div>
      )}
    </div>
  );
};

export default SmanelaLogo;
