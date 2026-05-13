import { GraduationCap } from 'lucide-react';

interface CDUTLogoProps {
  size?: number;
  showText?: boolean;
}

export const CDUTLogo = ({ size = 40, showText = true }: CDUTLogoProps) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="50" cy="50" r="48" fill="#00693e" stroke="#004d2a" strokeWidth="2"/>
        <circle cx="50" cy="50" r="44" fill="#f0f7f4" stroke="#00693e" strokeWidth="1"/>
        
        <ellipse cx="50" cy="50" rx="38" ry="38" fill="none" stroke="#00693e" strokeWidth="0.5" strokeDasharray="2 2"/>
        
        <ellipse cx="50" cy="50" rx="30" ry="12" fill="none" stroke="#00693e" strokeWidth="0.8" transform="rotate(-23 50 50)"/>
        <ellipse cx="50" cy="50" rx="30" ry="12" fill="none" stroke="#00693e" strokeWidth="0.8" transform="rotate(23 50 50)"/>
        <ellipse cx="50" cy="50" rx="30" ry="12" fill="none" stroke="#00693e" strokeWidth="0.8" transform="rotate(67 50 50)"/>
        
        <rect x="35" y="55" width="30" height="20" rx="2" fill="#00693e"/>
        <rect x="37" y="57" width="26" height="16" rx="1" fill="#f0f7f4"/>
        <line x1="40" y1="62" x2="60" y2="62" stroke="#00693e" strokeWidth="1"/>
        <line x1="40" y1="66" x2="55" y2="66" stroke="#00693e" strokeWidth="1"/>
        
        <path 
          d="M45 30 Q50 25 55 30 Q60 35 55 38 L48 38 Q45 38 45 35 Q45 32 45 30" 
          fill="#00693e" 
          stroke="#004d2a" 
          strokeWidth="0.5"
        />
        <circle cx="47" cy="32" r="1" fill="#f0f7f4"/>
        <circle cx="53" cy="32" r="1" fill="#f0f7f4"/>
        
        <path d="M46 38 L46 42 L47 44 L53 44 L54 42 L54 38" stroke="#00693e" strokeWidth="1" fill="none"/>
        
        <rect x="25" y="78" width="50" height="1" fill="#00693e"/>
        
        <text x="50" y="88" textAnchor="middle" fontSize="8" fill="#00693e" fontWeight="bold" fontFamily="serif">CDUT</text>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-[#00693e] leading-tight">成都理工大学</span>
          <span className="text-xs text-gray-500 leading-tight">Chengdu University of Technology</span>
        </div>
      )}
    </div>
  );
};

export const CDUTBadge = ({ size = 24 }: { size?: number }) => (
  <div className="w-10 h-10 bg-[#00693e] rounded-lg flex items-center justify-center">
    <GraduationCap className="text-white" size={size - 4} />
  </div>
);

export const SchoolMotto = () => (
  <div className="bg-gradient-to-r from-[#00693e]/10 via-[#00693e]/5 to-[#00693e]/10 py-3 px-6 rounded-lg border border-[#00693e]/20">
    <p className="text-center text-[#00693e] font-medium text-sm tracking-wide">
      穷究于事事物物之理 · 成就于实践实干之工
    </p>
  </div>
);

export const Footer = () => (
  <footer className="bg-[#00693e] text-white py-8 mt-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 100 100" className="opacity-80">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4"/>
            <rect x="35" y="55" width="30" height="20" rx="2" fill="currentColor"/>
            <path d="M45 30 Q50 25 55 30 Q60 35 55 38 L48 38 Q45 38 45 35" fill="currentColor"/>
          </svg>
          <div>
            <p className="font-semibold">成都理工大学图书馆</p>
            <p className="text-sm opacity-80">Chengdu University of Technology Library</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-sm opacity-80">1956 - {new Date().getFullYear()}</p>
          <p className="text-xs opacity-60 mt-1">技术支持：成都理工大学信息中心</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/20 text-center text-xs opacity-60">
        <p>联系我们：四川省成都市成华区二仙桥东三路1号 | 邮编：610059</p>
      </div>
    </div>
  </footer>
);
