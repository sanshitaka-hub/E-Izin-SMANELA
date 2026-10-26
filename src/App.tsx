import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  QrCode, 
  History, 
  School, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Sparkles,
  PhoneCall,
  ExternalLink,
  MessageSquare,
  GraduationCap,
  Shield,
  KeyRound,
  LogOut,
  Share2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PortalLogin } from './components/PortalLogin';
import { SiswaPortal } from './components/portals/SiswaPortal';
import { WakaPortal } from './components/portals/WakaPortal';
import { SatpamPortal } from './components/portals/SatpamPortal';
import { PermitDocumentModal } from './components/PermitDocumentModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ShareTeacherModal } from './components/ShareTeacherModal';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { ToastContainer, ToastNotification } from './components/NotificationToast';
import { ExitPermit, UserRole } from './types';
import { INITIAL_PERMITS, DEFAULT_WAKA, SCHOOL_INFO, PORTAL_CREDENTIALS } from './data/mockData';
import SmanelaLogo from './components/SmanelaLogo';

import { safeStorage } from './utils/storage';

const STORAGE_KEY = 'smanela_exit_permits_v4';
const WAKA_NAME_KEY = 'smanela_waka_name_v4';
const ACTIVE_ROLE_KEY = 'smanela_portal_role_v4';

export default function App() {
  // Current logged in portal role ('SISWA' | 'GURU' | 'SATPAM' | null)
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = safeStorage.getItem(ACTIVE_ROLE_KEY);
    if (saved === 'SISWA' || saved === 'GURU' || saved === 'SATPAM') {
      return saved;
    }
    return null; // Show portal login by default
  });

  // Waka Kesiswaan official name
  const [wakaName, setWakaName] = useState<string>(() => {
    return safeStorage.getItem(WAKA_NAME_KEY) || DEFAULT_WAKA.name;
  });

  // Exit Permits State
  const [permits, setPermits] = useState<ExitPermit[]>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved permits, using defaults:', e);
      }
    }
    return INITIAL_PERMITS;
  });

  // Modals state
  const [selectedDocumentPermit, setSelectedDocumentPermit] = useState<ExitPermit | null>(null);
  const [selectedWhatsAppPermit, setSelectedWhatsAppPermit] = useState<ExitPermit | null>(null);
  const [selectedShareTeacherPermit, setSelectedShareTeacherPermit] = useState<ExitPermit | null>(null);
  const [previewImageState, setPreviewImageState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    studentName: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    studentName: '',
  });

  // Toast notifications state
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Sync permits to storage
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(permits));
  }, [permits]);

  // Sync waka name
  useEffect(() => {
    safeStorage.setItem(WAKA_NAME_KEY, wakaName);
  }, [wakaName]);

  // Sync role to storage
  useEffect(() => {
    if (currentRole) {
      safeStorage.setItem(ACTIVE_ROLE_KEY, currentRole);
    } else {
      safeStorage.removeItem(ACTIVE_ROLE_KEY);
    }
  }, [currentRole]);

  // Handle portal login
  const handleRoleLogin = (role: UserRole) => {
    setCurrentRole(role);
    const welcomeMsg = role === 'SISWA'
      ? 'Selamat datang di Portal Siswa SMANELA. Anda dapat mengajukan izin mandiri.'
      : `Autentikasi ${PORTAL_CREDENTIALS[role].title} berhasil. Selamat bertugas.`;
    addToast(
      'info',
      `Login Berhasil: ${PORTAL_CREDENTIALS[role].title}`,
      welcomeMsg
    );
  };

  const handleSwitchPortal = () => {
    setCurrentRole(null);
  };

  // Helper to add toast notification
  const addToast = (
    type: 'success' | 'danger' | 'info',
    title: string,
    message: string,
    actionText?: string,
    onAction?: () => void
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, title, message, actionText, onAction }]);

    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  };

  // Handler: New Permit Created (Siswa Portal)
  const handlePermitCreated = (newPermit: ExitPermit) => {
    setPermits((prev) => [newPermit, ...prev]);

    addToast(
      'info',
      'Pengajuan Surat Izin Berhasil Terkirim',
      `Surat izin keluar Anda atas nama ${newPermit.studentName} (${newPermit.studentClass}) telah terdaftar dengan ID ${newPermit.id}. Menunggu persetujuan Waka Kesiswaan.`,
      'Lihat Kartu Pas QR',
      () => setSelectedDocumentPermit(newPermit)
    );
  };

  // Handler: Waka Approves Permit ("Diberi Izin Keluar")
  const handleApprovePermit = (permitId: string, notes?: string) => {
    const updatedPermits = permits.map((p) => {
      if (p.id === permitId) {
        return {
          ...p,
          status: 'DISETUJUI' as const,
          approvedAt: new Date().toISOString(),
          wakaNotes: notes || 'Diberi izin keluar oleh Waka Kesiswaan SMAN 1 Lawang.',
          wakaKesiswaanName: wakaName,
        };
      }
      return p;
    });

    setPermits(updatedPermits);
    const target = updatedPermits.find((p) => p.id === permitId);

    if (target) {
      addToast(
        'success',
        'NOTIFIKASI: Diberi Izin Keluar!',
        `Waka Kesiswaan (${wakaName}) telah MENYETUJUI izin keluar siswa ${target.studentName} (${target.studentClass}). QR Code gerbang kini AKTIF.`,
        'Share ke Guru Pengajar',
        () => setSelectedShareTeacherPermit(target)
      );

      // Automatically open WhatsApp prompt to notify parent
      setSelectedWhatsAppPermit(target);
    }
  };

  // Handler: Waka Rejects Permit ("Tidak Diberi Izin")
  const handleRejectPermit = (permitId: string, notes: string) => {
    const updatedPermits = permits.map((p) => {
      if (p.id === permitId) {
        return {
          ...p,
          status: 'DITOLAK' as const,
          approvedAt: new Date().toISOString(),
          wakaNotes: notes || 'Tidak diberi izin keluar oleh Waka Kesiswaan.',
          wakaKesiswaanName: wakaName,
        };
      }
      return p;
    });

    setPermits(updatedPermits);
    const target = updatedPermits.find((p) => p.id === permitId);

    if (target) {
      addToast(
        'danger',
        'NOTIFIKASI: Tidak Diberi Izin Keluar!',
        `Waka Kesiswaan (${wakaName}) TIDAK MEMBERI IZIN keluar untuk siswa ${target.studentName} (${target.studentClass}). Catatan: "${notes}".`,
        'Kirim Notifikasi WA ke Orang Tua',
        () => setSelectedWhatsAppPermit(target)
      );

      // Automatically open WhatsApp modal to notify parent about rejection
      setSelectedWhatsAppPermit(target);
    }
  };

  // Handler: Waka shares to teacher
  const handleMarkSharedToTeacher = (permitId: string, teacherName: string) => {
    setPermits((prev) =>
      prev.map((p) => {
        if (p.id === permitId) {
          return {
            ...p,
            sharedToTeacher: true,
            sharedToTeacherAt: new Date().toISOString(),
            targetTeacherName: teacherName,
          };
        }
        return p;
      })
    );

    addToast(
      'success',
      'Dispensasi Berhasil Di-share ke Guru',
      `Informasi izin keluar telah diteruskan ke ${teacherName}.`
    );
  };

  // Handler: Gate Check-Out (Satpam Portal)
  const handleCheckOut = (permitId: string, guardName: string) => {
    setPermits((prev) =>
      prev.map((p) => {
        if (p.id === permitId) {
          return {
            ...p,
            gateCheckedOutAt: new Date().toISOString(),
            securityGuardName: guardName,
          };
        }
        return p;
      })
    );

    const target = permits.find((p) => p.id === permitId);
    if (target) {
      addToast(
        'success',
        'Check-Out Gerbang Berhasil',
        `Siswa ${target.studentName} telah melewati pos satpam keluar sekolah pada pukul ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB.`
      );
    }
  };

  // Handler: Gate Check-In (Satpam Portal)
  const handleCheckIn = (permitId: string, guardName: string) => {
    setPermits((prev) =>
      prev.map((p) => {
        if (p.id === permitId) {
          return {
            ...p,
            gateCheckedInAt: new Date().toISOString(),
            securityGuardName: guardName,
          };
        }
        return p;
      })
    );

    const target = permits.find((p) => p.id === permitId);
    if (target) {
      addToast(
        'info',
        'Check-In Gerbang Masuk',
        `Siswa ${target.studentName} telah kembali masuk ke lingkungan SMAN 1 Lawang.`
      );
    }
  };

  // Handler: Mark WhatsApp as sent
  const handleMarkWhatsAppSent = (permitId: string, messageContent: string) => {
    setPermits((prev) =>
      prev.map((p) => {
        if (p.id === permitId) {
          return {
            ...p,
            whatsappSent: true,
            whatsappSentAt: new Date().toISOString(),
            whatsappMessageContent: messageContent,
          };
        }
        return p;
      })
    );
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data kembali ke contoh awal SMAN 1 Lawang?')) {
      setPermits(INITIAL_PERMITS);
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PERMITS));
      addToast('info', 'Data Direset', 'Data perizinan berhasil dikembalikan ke template awal SMANELA.');
    }
  };

  // Image preview modal opener
  const handlePreviewImage = (imageUrl: string, title: string, studentName: string) => {
    setPreviewImageState({
      isOpen: true,
      imageUrl,
      title,
      studentName,
    });
  };

  const pendingCount = permits.filter((p) => p.status === 'MENUNGGU').length;

  // IF NOT LOGGED IN, RENDER THE PORTAL LOGIN VIEW
  if (!currentRole) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans">
        <PortalLogin onLogin={handleRoleLogin} />
        <ToastContainer notifications={notifications} onDismiss={dismissToast} />
      </div>
    );
  }

  const activePortalInfo = PORTAL_CREDENTIALS[currentRole];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar 
        currentRole={currentRole}
        onSwitchPortal={handleSwitchPortal}
        pendingCount={pendingCount}
      />

      {/* Main Container: RENDER PORTAL TERPISAH SESUAI PERAN */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Portal Header Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 text-amber-300 flex items-center justify-center font-bold shrink-0">
              {currentRole === 'SISWA' && <GraduationCap className="w-5 h-5" />}
              {currentRole === 'GURU' && <ShieldCheck className="w-5 h-5" />}
              {currentRole === 'SATPAM' && <Shield className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {activePortalInfo.title}
                </span>
                {currentRole === 'SISWA' ? (
                  <span className="text-[10px] font-mono bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                    KODE AKSES: {activePortalInfo.code}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-emerald-900/80 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Akses Berwenang</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300">
                {activePortalInfo.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSwitchPortal}
              className="text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition flex items-center gap-1.5 border border-white/15"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Portal Login</span>
            </button>
          </div>
        </section>

        {/* 1. PORTAL SISWA: KHUSUS PENGAJUAN IZIN & PEMBERITAHUAN STATUS */}
        {currentRole === 'SISWA' && (
          <SiswaPortal
            permits={permits}
            onPermitCreated={handlePermitCreated}
            onViewDocument={(p) => setSelectedDocumentPermit(p)}
            onPreviewImage={handlePreviewImage}
            wakaName={wakaName}
          />
        )}

        {/* 2. PORTAL GURU / WAKA: KHUSUS PERSETUJUAN, SHARE KE GURU PENGAJAR, & REKAP */}
        {currentRole === 'GURU' && (
          <WakaPortal
            permits={permits}
            onApprovePermit={handleApprovePermit}
            onRejectPermit={handleRejectPermit}
            onOpenWhatsApp={(p) => setSelectedWhatsAppPermit(p)}
            onOpenShareTeacher={(p) => setSelectedShareTeacherPermit(p)}
            onViewDocument={(p) => setSelectedDocumentPermit(p)}
            onPreviewImage={handlePreviewImage}
            onResetData={handleResetData}
            wakaName={wakaName}
          />
        )}

        {/* 3. PORTAL SATPAM: KHUSUS PEMINDAI QR GERBANG & LOG LINTASAN POS */}
        {currentRole === 'SATPAM' && (
          <SatpamPortal
            permits={permits}
            onCheckOut={handleCheckOut}
            onCheckIn={handleCheckIn}
            onViewDocument={(p) => setSelectedDocumentPermit(p)}
            onOpenWhatsApp={(p) => setSelectedWhatsAppPermit(p)}
            onPreviewImage={handlePreviewImage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SmanelaLogo size="sm" />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide">{SCHOOL_INFO.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-widest shadow-xs">
                  {SCHOOL_INFO.motto}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{SCHOOL_INFO.address}</p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">
              Sistem Informasi Otomatis Surat Izin Keluar Siswa Berbasis Quick Response Code & WhatsApp
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              SMAN 1 Lawang Malang • {SCHOOL_INFO.motto}
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <PermitDocumentModal
        isOpen={!!selectedDocumentPermit}
        onClose={() => setSelectedDocumentPermit(null)}
        permit={selectedDocumentPermit}
        onOpenWhatsApp={(p) => setSelectedWhatsAppPermit(p)}
      />

      <WhatsAppModal
        isOpen={!!selectedWhatsAppPermit}
        onClose={() => setSelectedWhatsAppPermit(null)}
        permit={selectedWhatsAppPermit}
        onMarkAsSent={handleMarkWhatsAppSent}
      />

      <ShareTeacherModal
        isOpen={!!selectedShareTeacherPermit}
        onClose={() => setSelectedShareTeacherPermit(null)}
        permit={selectedShareTeacherPermit}
        onMarkShared={handleMarkSharedToTeacher}
      />

      <ImagePreviewModal
        isOpen={previewImageState.isOpen}
        onClose={() => setPreviewImageState((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={previewImageState.imageUrl}
        title={previewImageState.title}
        studentName={previewImageState.studentName}
      />

      {/* Floating Notifications */}
      <ToastContainer notifications={notifications} onDismiss={dismissToast} />
    </div>
  );
}
