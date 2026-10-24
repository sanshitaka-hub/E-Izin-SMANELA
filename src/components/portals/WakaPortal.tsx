import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Share2, 
  History, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  CheckCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { ExitPermit } from '../../types';
import { WakaDashboard } from '../WakaDashboard';
import { HistoryReport } from '../HistoryReport';

interface WakaPortalProps {
  permits: ExitPermit[];
  onApprovePermit: (permitId: string, notes?: string) => void;
  onRejectPermit: (permitId: string, notes: string) => void;
  onOpenWhatsApp: (permit: ExitPermit) => void;
  onOpenShareTeacher: (permit: ExitPermit) => void;
  onViewDocument: (permit: ExitPermit) => void;
  onPreviewImage: (imageUrl: string, title: string, studentName: string) => void;
  onResetData: () => void;
  wakaName: string;
}

export const WakaPortal: React.FC<WakaPortalProps> = ({
  permits,
  onApprovePermit,
  onRejectPermit,
  onOpenWhatsApp,
  onOpenShareTeacher,
  onViewDocument,
  onPreviewImage,
  onResetData,
  wakaName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'approval' | 'shareTeacher' | 'report'>('approval');
  const [searchTeacherShare, setSearchTeacherShare] = useState('');

  const pendingCount = permits.filter((p) => p.status === 'MENUNGGU').length;
  const approvedPermits = permits.filter((p) => p.status === 'DISETUJUI');

  const filteredApproved = approvedPermits.filter((p) => {
    if (!searchTeacherShare) return true;
    return (
      p.studentName.toLowerCase().includes(searchTeacherShare.toLowerCase()) ||
      p.studentClass.toLowerCase().includes(searchTeacherShare.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTeacherShare.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Waka Sub Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-blue-100 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveSubTab('approval')}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'approval'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Meja Persetujuan Waka</span>
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('shareTeacher')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'shareTeacher'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
            }`}
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>Share ke Guru Pengajar</span>
            <span className="bg-blue-100 text-blue-900 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {approvedPermits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('report')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'report'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Rekapitulasi Kesiswaan</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 pr-3 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="font-semibold text-blue-950">Portal Waka Kesiswaan SMANELA ({wakaName})</span>
        </div>
      </div>

      {/* VIEW 1: APPROVAL DESK */}
      {activeSubTab === 'approval' && (
        <WakaDashboard
          permits={permits}
          onApprovePermit={onApprovePermit}
          onRejectPermit={onRejectPermit}
          onOpenWhatsApp={onOpenWhatsApp}
          onViewDocument={onViewDocument}
          onPreviewImage={onPreviewImage}
          wakaName={wakaName}
        />
      )}

      {/* VIEW 2: SHARE KE GURU PENGAJAR */}
      {activeSubTab === 'shareTeacher' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 uppercase">
                  Fitur Khusus Waka
                </span>
                <span className="text-xs text-blue-200">Dispensasi Kesiswaan SMANELA</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Share Dispensasi Izin ke Guru Pengajar & Wali Kelas
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
                Teruskan secara instan surat izin yang telah disetujui Waka Kesiswaan ke nomor WhatsApp Guru Mapel yang sedang mengajar atau ke Grup Guru SMAN 1 Lawang agar presensi kelas sinkron.
              </p>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTeacherShare}
              onChange={(e) => setSearchTeacherShare(e.target.value)}
              placeholder="Cari siswa yang disetujui untuk di-share ke guru pengajar..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 shadow-2xs"
            />
          </div>

          {/* Cards for sharing to teacher */}
          <div className="space-y-3">
            {filteredApproved.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="font-bold text-gray-700">Belum Ada Siswa yang Diberi Izin</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Beri izin keluar terlebih dahulu pada Meja Persetujuan Waka untuk meneruskan ke guru pengajar.
                </p>
              </div>
            ) : (
              filteredApproved.map((permit) => (
                <div
                  key={permit.id}
                  className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
                        {permit.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                        DISETUJUI WAKA
                      </span>
                      {permit.sharedToTeacher && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-300">
                          <CheckCheck className="w-3 h-3 text-blue-700" />
                          <span>Sudah Di-share ke Guru: {permit.targetTeacherName || 'Guru Mapel'}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-gray-950 uppercase">
                      {permit.studentName} <span className="text-blue-900 font-bold">({permit.studentClass})</span>
                    </h4>

                    <p className="text-xs text-gray-600">
                      Jadwal Keluar: <strong>Pukul {permit.timeOut} WIB</strong> • Keperluan: {permit.reasonCategory} ({permit.reasonDetail})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenShareTeacher(permit)}
                      className="px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4 text-amber-300" />
                      <span>Share ke Guru Pengajar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenWhatsApp(permit)}
                      className="px-3.5 py-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      title="Kirim ke WA Orang Tua"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WA Ortu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDocument(permit)}
                      className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                    >
                      Lihat Surat
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: REKAPITULASI */}
      {activeSubTab === 'report' && (
        <HistoryReport
          permits={permits}
          onViewDocument={onViewDocument}
          onOpenWhatsApp={onOpenWhatsApp}
          onPreviewImage={onPreviewImage}
          onResetData={onResetData}
        />
      )}
    </div>
  );
};
