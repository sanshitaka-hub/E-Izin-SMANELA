import React, { useState } from 'react';
import { 
  QrCode, 
  BookOpen, 
  Shield, 
  CheckCircle, 
  LogOut, 
  LogIn, 
  Clock, 
  Search,
  UserCheck
} from 'lucide-react';
import { ExitPermit } from '../../types';
import { GateScanner } from '../GateScanner';

interface SatpamPortalProps {
  permits: ExitPermit[];
  onCheckOut: (permitId: string, guardName: string) => void;
  onCheckIn: (permitId: string, guardName: string) => void;
  onViewDocument: (permit: ExitPermit) => void;
  onOpenWhatsApp: (permit: ExitPermit) => void;
  onPreviewImage: (imageUrl: string, title: string, studentName: string) => void;
}

export const SatpamPortal: React.FC<SatpamPortalProps> = ({
  permits,
  onCheckOut,
  onCheckIn,
  onViewDocument,
  onOpenWhatsApp,
  onPreviewImage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'gateLogs'>('scanner');
  const [logFilter, setLogFilter] = useState<'ALL' | 'OUT' | 'RETURNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Gate logs are approved permits that have been checked out
  const gateLogs = permits.filter((p) => p.status === 'DISETUJUI' && p.gateCheckedOutAt);

  const filteredLogs = gateLogs.filter((p) => {
    const matchesFilter =
      logFilter === 'ALL'
        ? true
        : logFilter === 'OUT'
        ? !p.gateCheckedInAt
        : !!p.gateCheckedInAt;

    const matchesSearch =
      !searchQuery ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const currentlyOutCount = gateLogs.filter((p) => !p.gateCheckedInAt).length;

  return (
    <div className="space-y-6">
      {/* Satpam Sub Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-blue-100 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'scanner'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Pemindai QR Code Pos Gerbang</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gateLogs')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'gateLogs'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Buku Log Lintasan Siswa</span>
            {currentlyOutCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                {currentlyOutCount} Di Luar
              </span>
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 pr-3 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="font-semibold text-blue-950">Pos Keamanan Gerbang Utama SMANELA</span>
        </div>
      </div>

      {/* VIEW 1: GATE SCANNER */}
      {activeSubTab === 'scanner' && (
        <GateScanner
          permits={permits}
          onCheckOut={onCheckOut}
          onCheckIn={onCheckIn}
          onViewDocument={onViewDocument}
          onOpenWhatsApp={onOpenWhatsApp}
          onPreviewImage={onPreviewImage}
        />
      )}

      {/* VIEW 2: BUKU LOG LINTASAN POS */}
      {activeSubTab === 'gateLogs' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white uppercase">
                  Buku Catatan Satpam
                </span>
                <span className="text-xs text-blue-200">Gerbang SMAN 1 Lawang</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Log Lintasan Keluar Masuk Siswa Hari Ini
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Daftar rekaman siswa yang telah melintasi pos satpam dengan surat izin resmi yang sah.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  logFilter === 'ALL' ? 'bg-white text-slate-900' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Semua ({gateLogs.length})
              </button>
              <button
                onClick={() => setLogFilter('OUT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  logFilter === 'OUT' ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Sedang di Luar ({currentlyOutCount})
              </button>
              <button
                onClick={() => setLogFilter('RETURNED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  logFilter === 'RETURNED' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Sudah Masuk ({gateLogs.length - currentlyOutCount})
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa di buku log gerbang..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700 border-collapse">
                <thead className="bg-gray-50 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-200 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. Izin</th>
                    <th className="py-3 px-4">Nama Siswa & Kelas</th>
                    <th className="py-3 px-4">Waktu Check-Out (Keluar)</th>
                    <th className="py-3 px-4">Waktu Check-In (Kembali)</th>
                    <th className="py-3 px-4">Petugas Satpam</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        Belum ada siswa yang tercatat melintasi pos gerbang.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((permit) => (
                      <tr key={permit.id} className="hover:bg-blue-50/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {permit.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-gray-950 uppercase block">{permit.studentName}</span>
                          <span className="text-[10px] font-semibold text-emerald-800">Kelas {permit.studentClass}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <LogOut className="w-3 h-3 text-amber-600" />
                            {permit.gateCheckedOutAt
                              ? new Date(permit.gateCheckedOutAt).toLocaleTimeString('id-ID') + ' WIB'
                              : '-'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {permit.gateCheckedInAt ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <LogIn className="w-3 h-3 text-emerald-600" />
                              {new Date(permit.gateCheckedInAt).toLocaleTimeString('id-ID')} WIB
                            </span>
                          ) : permit.isReturning ? (
                            <span className="text-amber-600 font-bold text-[11px] animate-pulse">
                              ⏳ Belum Kembali
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Izin pulang</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {permit.securityGuardName || 'Satpam Gerbang'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onViewDocument(permit)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 rounded-lg text-xs font-semibold transition"
                          >
                            Lihat QR
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
