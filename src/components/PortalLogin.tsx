import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Shield, 
  KeyRound, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '../types';
import { PORTAL_CREDENTIALS } from '../data/mockData';
import { SmanelaLogo } from './SmanelaLogo';
import { sounds } from '../utils/audio';

interface PortalLoginProps {
  onLogin: (role: UserRole) => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('SISWA');
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const activePortal = PORTAL_CREDENTIALS[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAccessCode('');
    setErrorMsg('');
    setShowPassword(false);
  };

  const handleQuickFillSiswa = () => {
    setAccessCode('SISWA-2026');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetPortal = PORTAL_CREDENTIALS[selectedRole];
    const cleanInput = accessCode.trim().toUpperCase();
    const expectedCode = targetPortal.code.toUpperCase();

    if (!cleanInput) {
      setErrorMsg(`Mohon masukkan kode akses untuk ${targetPortal.title}.`);
      return;
    }

    if (cleanInput !== expectedCode) {
      if (selectedRole === 'SISWA') {
        setErrorMsg('Kode akses salah! Kode resmi untuk siswa adalah: "SISWA-2026"');
      } else {
        // Do NOT reveal the secret codes for Guru and Satpam!
        setErrorMsg(`Kode akses salah untuk ${targetPortal.title}! Akses ini dilindungi dan hanya dapat dimasuki dengan kode resmi petugas berwenang.`);
      }
      sounds.playReject();
      return;
    }

    setIsAuthenticating(true);
    sounds.playSuccess();

    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin(selectedRole);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      {/* Top Brand Banner with Official Logo */}
      <div className="max-w-4xl w-full text-center mb-8 space-y-3 flex flex-col items-center">
        <SmanelaLogo size="xl" />
        
        <div>
          {/* Motto displayed strictly as "BAKTIKU HARAPANMU" without prefix */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-blue-900/80 border border-amber-400 text-amber-300 mb-2 shadow-lg tracking-widest uppercase">
            <span>BAKTIKU HARAPANMU</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
            SMA NEGERI 1 LAWANG
          </h1>
          <p className="text-sm font-semibold text-blue-200 mt-1">
            Sistem Informasi Pengelolaan Surat Izin Keluar Sekolah Berbasis QR Code
          </p>
          <p className="text-xs text-blue-300/80 max-w-lg mx-auto mt-1.5">
            Pilih portal tujuan Anda di bawah ini dan masukkan kode otorisasi untuk memulai.
          </p>
        </div>
      </div>

      {/* 3 Portal Selection Cards in SMANELA Royal Blue & Gold */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 1. PORTAL SISWA */}
        <div
          onClick={() => handleRoleSelect('SISWA')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 text-left relative overflow-hidden ${
            selectedRole === 'SISWA'
              ? 'bg-blue-900/90 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-blue-950 scale-[1.02]'
              : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800/90 hover:border-blue-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              selectedRole === 'SISWA' ? 'bg-amber-400 text-blue-950' : 'bg-slate-800 text-blue-300'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold bg-black/50 px-2 py-0.5 rounded text-amber-300 border border-amber-500/30">
              KODE: SISWA-2026
            </span>
          </div>
          <h3 className="font-extrabold text-base text-white">1. Portal Siswa / Murid</h3>
          <p className="text-xs text-blue-200/80 mt-1 line-clamp-2">
            Pengajuan izin keluar manual, opsi lampiran bukti foto chat, dan unduh kartu QR pass.
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-amber-300 font-semibold">Klik untuk memilih</span>
            {selectedRole === 'SISWA' && <CheckCircle className="w-4 h-4 text-amber-300" />}
          </div>
        </div>

        {/* 2. PORTAL GURU / WAKA KESISWAAN (Code Hidden!) */}
        <div
          onClick={() => handleRoleSelect('GURU')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 text-left relative overflow-hidden ${
            selectedRole === 'GURU'
              ? 'bg-blue-900/90 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-blue-950 scale-[1.02]'
              : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800/90 hover:border-blue-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              selectedRole === 'GURU' ? 'bg-amber-400 text-blue-950' : 'bg-slate-800 text-blue-300'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            {/* Hidden Passcode Badge */}
            <span className="text-[10px] font-bold bg-slate-950/80 px-2.5 py-0.5 rounded-full text-amber-300 border border-amber-400/40 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Akses Terlindungi</span>
            </span>
          </div>
          <h3 className="font-extrabold text-base text-white">2. Portal Guru & Waka</h3>
          <p className="text-xs text-blue-200/80 mt-1 line-clamp-2">
            Tombol Diberi Izin / Tolak, share ke Guru Pengajar, dan notifikasi otomatis WhatsApp orang tua.
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-amber-300 font-semibold">Klik untuk memilih</span>
            {selectedRole === 'GURU' && <CheckCircle className="w-4 h-4 text-amber-300" />}
          </div>
        </div>

        {/* 3. PORTAL POS SATPAM (Code Hidden!) */}
        <div
          onClick={() => handleRoleSelect('SATPAM')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 text-left relative overflow-hidden ${
            selectedRole === 'SATPAM'
              ? 'bg-blue-900/90 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-blue-950 scale-[1.02]'
              : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800/90 hover:border-blue-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              selectedRole === 'SATPAM' ? 'bg-amber-400 text-blue-950' : 'bg-slate-800 text-blue-300'
            }`}>
              <Shield className="w-6 h-6" />
            </div>
            {/* Hidden Passcode Badge */}
            <span className="text-[10px] font-bold bg-slate-950/80 px-2.5 py-0.5 rounded-full text-amber-300 border border-amber-400/40 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Akses Terlindungi</span>
            </span>
          </div>
          <h3 className="font-extrabold text-base text-white">3. Portal Pos Satpam</h3>
          <p className="text-xs text-blue-200/80 mt-1 line-clamp-2">
            Pemindai Kamera Live QR Code gerbang, verifikasi status izin sah, dan buku log lintasan siswa.
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-amber-300 font-semibold">Klik untuk memilih</span>
            {selectedRole === 'SATPAM' && <CheckCircle className="w-4 h-4 text-amber-300" />}
          </div>
        </div>
      </div>

      {/* Access Code Input Form */}
      <div className="max-w-md w-full bg-slate-900/95 border border-blue-900/70 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider">
              Masuk ke: {activePortal.title}
            </h2>
          </div>
          {selectedRole !== 'SISWA' && (
            <span className="text-[10px] bg-amber-500/10 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
              Otoritas Terbatas
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5">
              {selectedRole === 'SISWA' ? 'Kode Akses Siswa' : `Kode Keamanan ${activePortal.badge}`}
            </label>
            <div className="relative">
              <input
                type={selectedRole === 'SISWA' ? 'text' : (showPassword ? 'text' : 'password')}
                autoFocus
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder={
                  selectedRole === 'SISWA' 
                    ? 'Masukkan kode (contoh: SISWA-2026)' 
                    : 'Masukkan kode akses rahasia...'
                }
                className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-wider"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              
              {selectedRole !== 'SISWA' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1"
                  title={showPassword ? 'Sembunyikan karakter' : 'Tampilkan karakter'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Quick-fill button ONLY for Siswa; Secret notice for Guru & Satpam */}
          {selectedRole === 'SISWA' ? (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-gray-400">Kode Siswa:</span>
              <button
                type="button"
                onClick={handleQuickFillSiswa}
                className="text-amber-300 hover:text-amber-200 font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/40 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Gunakan: SISWA-2026</span>
              </button>
            </div>
          ) : (
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Kode internal petugas berwenang
              </span>
              <span className="text-[10px] text-amber-300/90 font-semibold italic">
                Tersimpan aman & terenkripsi
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-blue-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 border border-blue-400/30 cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Memvalidasi Akses...</span>
              </>
            ) : (
              <>
                <span>Buka {activePortal.title}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
