import React, { useState } from 'react';
import { 
  FileText, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  QrCode, 
  Eye, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  Search,
  ExternalLink,
  Phone
} from 'lucide-react';
import { ExitPermit } from '../../types';
import { PermitForm } from '../PermitForm';

interface SiswaPortalProps {
  permits: ExitPermit[];
  onPermitCreated: (newPermit: ExitPermit) => void;
  onViewDocument: (permit: ExitPermit) => void;
  onPreviewImage: (imageUrl: string, title: string, studentName: string) => void;
  wakaName: string;
}

export const SiswaPortal: React.FC<SiswaPortalProps> = ({
  permits,
  onPermitCreated,
  onViewDocument,
  onPreviewImage,
  wakaName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'status'>('form');
  const [searchStudent, setSearchStudent] = useState('');

  // Auto switch to status tab when new permit is created
  const handleCreated = (newPermit: ExitPermit) => {
    onPermitCreated(newPermit);
    setActiveSubTab('status');
  };

  const filteredPermits = permits.filter((p) => {
    if (!searchStudent) return true;
    return (
      p.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      p.studentClass.toLowerCase().includes(searchStudent.toLowerCase()) ||
      p.id.toLowerCase().includes(searchStudent.toLowerCase())
    );
  });

  const latestPermit = permits[0];

  return (
    <div className="space-y-6">
      {/* Portal Siswa Sub-Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-emerald-100 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'form'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Formulir Pengajuan Izin Baru</span>
          </button>

          <button
            onClick={() => setActiveSubTab('status')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'status'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Pemberitahuan & Status Izin Siswa</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {permits.length}
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 pr-3 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Portal Khusus Siswa & Murid SMANELA</span>
        </div>
      </div>

      {/* VIEW 1: FORM PENGAJUAN IZIN */}
      {activeSubTab === 'form' && (
        <PermitForm onPermitCreated={handleCreated} wakaName={wakaName} />
      )}

      {/* VIEW 2: PEMBERITAHUAN & STATUS IZIN SISWA */}
      {activeSubTab === 'status' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 uppercase">
                  Pemberitahuan Resmi
                </span>
                <span className="text-xs text-emerald-200">SMAN 1 Lawang</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Status Perizinan & Kartu Pas Gerbang Anda
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                Pantau langsung apakah izin Anda telah <strong>Diberi Izin</strong> atau <strong>Ditolak</strong> oleh Waka Kesiswaan.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('form')}
              className="px-4 py-2.5 bg-white text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition shadow shrink-0"
            >
              + Ajukan Izin Baru
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari berdasarkan nama Anda, kelas, atau nomor perizinan..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          {/* Permits Cards */}
          <div className="space-y-4">
            {filteredPermits.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="font-bold text-gray-700">Belum Ada Pengajuan Izin</h3>
                <p className="text-xs text-gray-500 mt-1">Silakan ajukan izin keluar melalui formulir di atas.</p>
              </div>
            ) : (
              filteredPermits.map((permit) => {
                const isApproved = permit.status === 'DISETUJUI';
                const isRejected = permit.status === 'DITOLAK';
                const isPending = permit.status === 'MENUNGGU';

                return (
                  <div
                    key={permit.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                      isApproved
                        ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                        : isRejected
                        ? 'border-rose-300'
                        : 'border-amber-300'
                    }`}
                  >
                    {/* Top status notification bar */}
                    <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${
                      isApproved
                        ? 'bg-emerald-600 text-white'
                        : isRejected
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        {isApproved && <CheckCircle className="w-5 h-5 text-emerald-100" />}
                        {isRejected && <XCircle className="w-5 h-5 text-rose-100" />}
                        {isPending && <Clock className="w-5 h-5 text-amber-100 animate-spin" />}
                        <div>
                          <p className="font-black text-sm uppercase tracking-wide">
                            {isApproved
                              ? 'SURAT IZIN DISETUJUI (DIBERI IZIN KELUAR)'
                              : isRejected
                              ? 'PERMOHONAN TIDAK DIBERI IZIN (DITOLAK)'
                              : 'MENUNGGU KEPUTUSAN WAKA KESISWAAN'}
                          </p>
                          <p className="text-[11px] opacity-90">
                            No. Izin: <span className="font-mono font-bold">{permit.id}</span> • Diajukan: {permit.date} ({permit.timeOut} WIB)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onViewDocument(permit)}
                        className="px-3.5 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-100 transition shadow-xs flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Buka Kartu Pas QR Digital</span>
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-8 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Identitas Siswa:</span>
                          <h3 className="text-lg font-black text-gray-950 uppercase">{permit.studentName}</h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              Kelas {permit.studentClass}
                            </span>
                            {permit.nisn && <span className="font-mono text-gray-500">NISN: {permit.nisn}</span>}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                          <p className="text-gray-500 font-semibold">Keperluan Keluar:</p>
                          <p className="text-gray-900 font-medium">
                            <strong className="text-emerald-800 mr-1">[{permit.reasonCategory}]</strong>
                            {permit.reasonDetail}
                          </p>
                          <p className="text-[11px] text-gray-500 pt-1">
                            Rencana Keluar: <strong>{permit.timeOut} WIB</strong> |{' '}
                            {permit.isReturning && permit.estimatedReturnTime
                              ? `Estimasi Kembali: ${permit.estimatedReturnTime} WIB`
                              : 'Tidak kembali ke sekolah hari ini'}
                          </p>
                        </div>

                        {/* Waka note if available */}
                        {permit.wakaNotes && (
                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                            <span className="font-bold">Catatan Waka Kesiswaan ({permit.wakaKesiswaanName}):</span>{' '}
                            <span className="italic">"{permit.wakaNotes}"</span>
                          </div>
                        )}
                      </div>

                      {/* Right info / Gate status */}
                      <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-5 space-y-3">
                        <div className="space-y-2">
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                            <p className="font-bold text-emerald-900">Notifikasi Orang Tua:</p>
                            <p className="text-[11px] text-gray-600 mt-0.5">
                              {permit.parentName} ({permit.parentPhone})
                            </p>
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{permit.whatsappSent ? 'Pesan WhatsApp Terkirim' : 'Menunggu Pengiriman WA'}</span>
                            </div>
                          </div>

                          {/* Gate Checkout status */}
                          {permit.gateCheckedOutAt && (
                            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                              <span className="font-bold">Status Gerbang:</span>
                              <p className="text-[11px]">
                                Melewati satpam pukul {new Date(permit.gateCheckedOutAt).toLocaleTimeString('id-ID')} WIB
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onViewDocument(permit)}
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Tampilkan QR di Pos Gerbang</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
