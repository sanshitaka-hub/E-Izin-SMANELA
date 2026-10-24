import React from 'react';
import { 
  Clock,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Shield,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { SCHOOL_INFO, PORTAL_CREDENTIALS } from '../data/mockData';
import { SmanelaLogo } from './SmanelaLogo';

interface NavbarProps {
  currentRole: UserRole;
  onSwitchPortal: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRole, 
  onSwitchPortal,
  pendingCount = 0 
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const portalInfo = PORTAL_CREDENTIALS[currentRole];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs no-print">
      {/* Top SMANELA Blue micro banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-blue-100 px-4 py-1.5 text-xs flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Sistem Resmi E-Izin Keluar Kampus SMANELA • Kab. Malang</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono bg-black/40 px-2 py-0.5 rounded text-[11px] text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{currentTime || 'Memuat...'}</span>
          </div>
          <span className="hidden sm:inline text-blue-200">NPSN: 20517772</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & SMANELA Identity */}
          <div className="flex items-center gap-3">
            <SmanelaLogo size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black tracking-tight text-blue-950">
                  SMAN 1 LAWANG
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300 uppercase tracking-wide">
                  ⭐ {SCHOOL_INFO.motto}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium line-clamp-1">
                E-Perizinan Siswa Berbasis Quick Response Code
              </p>
            </div>
          </div>

          {/* Center: Current Portal Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
                {currentRole === 'SISWA' && <GraduationCap className="w-4 h-4 text-amber-300" />}
                {currentRole === 'GURU' && <ShieldCheck className="w-4 h-4 text-amber-300" />}
                {currentRole === 'SATPAM' && <Shield className="w-4 h-4 text-amber-300" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-gray-950">{portalInfo.title}</span>
                  {currentRole === 'SISWA' ? (
                    <span className="text-[10px] font-mono font-bold bg-blue-900 text-amber-300 px-1.5 py-0.2 rounded border border-blue-700">
                      SISWA-2026
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Otoritas Sah
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-blue-800 font-semibold hidden sm:block">
                  Sesi Login Terverifikasi Aktif
                </p>
              </div>
            </div>
          </div>

          {/* Right: Switch Portal / Logout Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchPortal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-blue-950 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs group"
              title="Keluar ke Menu Pilihan Portal Login"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Ganti Portal</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
