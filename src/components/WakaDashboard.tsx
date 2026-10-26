import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Search, 
  Eye, 
  User, 
  Phone, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  CheckCheck,
  AlertTriangle,
  Send,
  SlidersHorizontal,
  ChevronRight,
  Share2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExitPermit } from '../types';
import { sounds } from '../utils/audio';
import { getDaysRemaining } from '../utils/permitCleanup';

interface WakaDashboardProps {
  permits: ExitPermit[];
  onApprovePermit: (permitId: string, notes?: string) => void;
  onRejectPermit: (permitId: string, notes: string) => void;
  onOpenWhatsApp: (permit: ExitPermit) => void;
  onOpenShareTeacher?: (permit: ExitPermit) => void;
  onViewDocument: (permit: ExitPermit) => void;
  onPreviewImage: (imageUrl: string, title: string, studentName: string) => void;
  onDeletePermit?: (permitId: string) => void;
  wakaName: string;
}

export const WakaDashboard: React.FC<WakaDashboardProps> = ({
  permits,
  onApprovePermit,
  onRejectPermit,
  onOpenWhatsApp,
  onOpenShareTeacher,
  onViewDocument,
  onPreviewImage,
  onDeletePermit,
  wakaName,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState<string>('');
  const [selectedRejectPermit, setSelectedRejectPermit] = useState<ExitPermit | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [deleteConfirmPermit, setDeleteConfirmPermit] = useState<ExitPermit | null>(null);

  // Handle Approve button click
  const handleApprove = (permit: ExitPermit) => {
    sounds.playSuccess();
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#1e3a8a', '#2563eb', '#3b82f6', '#f59e0b', '#fbbf24'],
    });
    onApprovePermit(permit.id, customNote || 'Diberi izin keluar oleh Waka Kesiswaan.');
    setCustomNote('');
    setActiveNotesId(null);
  };

  // Open Reject Modal
  const openRejectDialog = (permit: ExitPermit) => {
    setSelectedRejectPermit(permit);
    setRejectReason('Tidak memenuhi kriteria izin / kegiatan belajar mengajar sedang krusial.');
  };

  // Confirm Reject
  const confirmReject = () => {
    if (!selectedRejectPermit) return;
    sounds.playReject();
    onRejectPermit(selectedRejectPermit.id, rejectReason);
    setSelectedRejectPermit(null);
    setRejectReason('');
  };

  // Filtered permits
  const filteredPermits = permits.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' ? true : p.status === filterStatus;
    const matchesSearch = 
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = permits.filter((p) => p.status === 'MENUNGGU').length;
  const approvedCount = permits.filter((p) => p.status === 'DISETUJUI').length;
  const rejectedCount = permits.filter((p) => p.status === 'DITOLAK').length;

  return (
    <div className="space-y-6">
      {/* Waka Profile & Stats Header */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex items-center justify-center shadow-md ring-4 ring-blue-50">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Pusat Otoritas Kesiswaan
              </span>
              <span className="text-xs text-gray-500 font-medium">SMAN 1 Lawang</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">
              Meja Persetujuan Waka Kesiswaan
            </h1>
            <p className="text-xs text-gray-500">
              Pejabat Berwenang: <span className="font-bold text-blue-950">{wakaName}</span>
            </p>
          </div>
        </div>

        {/* Quick badge filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'ALL'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span>Semua</span>
            <span className="bg-white/20 text-inherit px-1.5 py-0.2 rounded-full text-[10px]">
              {permits.length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('MENUNGGU')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'MENUNGGU'
                ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Perlu Tindakan</span>
            {pendingCount > 0 && (
              <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterStatus('DISETUJUI')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'DISETUJUI'
                ? 'bg-blue-800 text-white shadow-xs shadow-blue-800/20'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Diberi Izin</span>
            <span className="bg-blue-900/20 text-inherit px-1.5 py-0.2 rounded-full text-[10px]">
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('DITOLAK')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'DITOLAK'
                ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/20'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Tidak Diberi Izin</span>
            <span className="bg-rose-700/20 text-inherit px-1.5 py-0.2 rounded-full text-[10px]">
              {rejectedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama siswa, kelas, nama orang tua, atau nomor surat (contoh: Alif, XI-2)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 shadow-2xs"
        />
      </div>

      {/* Permits List */}
      {filteredPermits.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">Tidak ada data perizinan yang sesuai</h3>
          <p className="text-xs text-gray-500 mt-1">
            Belum ada permohonan surat izin keluar dengan filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPermits.map((permit) => {
            const isPending = permit.status === 'MENUNGGU';
            const isApproved = permit.status === 'DISETUJUI';
            const isRejected = permit.status === 'DITOLAK';

            return (
              <div
                key={permit.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden ${
                  isPending
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : isApproved
                    ? 'border-blue-300 ring-1 ring-blue-100'
                    : 'border-rose-200'
                }`}
              >
                {/* Header row with status badge */}
                <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 ${
                  isPending
                    ? 'bg-amber-50/60 border-amber-200/60'
                    : isApproved
                    ? 'bg-blue-50/70 border-blue-200/70'
                    : 'bg-rose-50/60 border-rose-200/60'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-800 bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                      {permit.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      Diajukan: {new Date(permit.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB ({permit.date})
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Masa Aktif: Sisa {getDaysRemaining(permit)} hari
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>MENUNGGU PERSETUJUAN WAKA</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-700 text-white shadow-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>DIBERI IZIN KELUAR</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>TIDAK DIBERI IZIN (DITOLAK)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Student & Parent Details (7 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-gray-950 uppercase tracking-tight">
                            {permit.studentName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
                            {permit.studentClass}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          NISN: {permit.nisn}
                        </p>
                      </div>
                    </div>

                    {/* Detailed info pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                      <div>
                        <span className="font-semibold text-gray-500 block">Orang Tua / Wali:</span>
                        <p className="font-bold text-gray-800">{permit.parentName}</p>
                        <p className="font-mono text-blue-800 font-semibold">{permit.parentPhone}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-500 block">Jadwal Keluar Sekolah:</span>
                        <p className="font-bold text-gray-900 font-mono">Pukul {permit.timeOut} WIB</p>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-500 block">Estimasi Kembali:</span>
                        {permit.isReturning && permit.estimatedReturnTime ? (
                          <p className="font-bold text-blue-900 font-mono">Pukul {permit.estimatedReturnTime} WIB</p>
                        ) : (
                          <p className="text-gray-500 italic">Tidak kembali hari ini</p>
                        )}
                      </div>
                    </div>

                    {/* Alasan Keluar (Keperluan apa) */}
                    <div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">
                        Alasan Keluar / Keperluan:
                      </span>
                      <div className="p-3 bg-blue-50/40 border border-blue-200/70 rounded-xl text-xs sm:text-sm text-gray-800">
                        <span className="font-bold text-blue-950 bg-white px-2 py-0.5 rounded border border-blue-300 mr-2 text-xs">
                          {permit.reasonCategory}
                        </span>
                        <span>{permit.reasonDetail}</span>
                      </div>
                    </div>

                    {/* Waka notes if present */}
                    {permit.wakaNotes && (
                      <div className="p-3 bg-gray-100/80 rounded-xl text-xs text-gray-700 border border-gray-200">
                        <span className="font-bold text-gray-900">Catatan Waka ({permit.wakaKesiswaanName}):</span>{' '}
                        <span className="italic">{permit.wakaNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Screenshot Proof & Quick Document Preview (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                          <span>Bukti Izin Orang Tua</span>
                        </span>
                        {permit.hasParentProof && permit.parentProofImage && (
                          <button
                            type="button"
                            onClick={() =>
                              onPreviewImage(
                                permit.parentProofImage!,
                                'Bukti Perizinan Orang Tua (WhatsApp / Surat)',
                                permit.studentName
                              )
                            }
                            className="text-[11px] font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Perbesar</span>
                          </button>
                        )}
                      </div>

                      {/* Thumbnail container or No-Photo Badge */}
                      {permit.hasParentProof && permit.parentProofImage ? (
                        <div
                          onClick={() =>
                            onPreviewImage(
                              permit.parentProofImage!,
                              'Bukti Perizinan Orang Tua (WhatsApp / Surat)',
                              permit.studentName
                            )
                          }
                          className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200 bg-gray-950 max-h-36 flex items-center justify-center shadow-inner"
                        >
                          <img
                            src={permit.parentProofImage}
                            alt="Bukti Perizinan"
                            className="max-h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>Lihat Bukti Foto</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-1">
                          <span className="text-lg">📞</span>
                          <p className="text-xs font-bold text-gray-700">Tanpa Lampiran Foto</p>
                          <p className="text-[11px] text-gray-500">Izin via konfirmasi telepon/lisan ke no. {permit.parentPhone}</p>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Status pill */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-700" />
                          <div>
                            <p className="font-bold text-gray-800">WhatsApp Ortu</p>
                            <p className="text-[10px] text-gray-500">
                              {permit.whatsappSent ? 'Pesan telah terkirim' : 'Pesan belum dikirim'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenWhatsApp(permit)}
                          className="px-2.5 py-1 bg-white hover:bg-blue-700 hover:text-white border border-blue-300 text-blue-900 font-bold rounded-lg text-xs transition shadow-2xs"
                        >
                          Kirim WA
                        </button>
                      </div>
                    </div>

                    {/* View printable document button */}
                    <button
                      type="button"
                      onClick={() => onViewDocument(permit)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition border border-gray-300"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-600" />
                      <span>Lihat Surat & QR Code Resmi</span>
                    </button>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR: TOMBOL DIBERI IZIN & TIDAK DIBERI IZIN */}
                <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 w-full sm:w-auto">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Wewenang Waka Kesiswaan ({permit.wakaKesiswaanName})</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {/* TOMBOL PENGHAPUS SURAT IZIN YANG TELAH DI ACC */}
                    {isApproved && onDeletePermit && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmPermit(permit)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 shadow-2xs"
                        title="Hapus surat izin yang telah di-ACC ini"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <span>Hapus Izin ACC</span>
                      </button>
                    )}

                    {/* TOMBOL TIDAK DIBERI IZIN */}
                    <button
                      type="button"
                      onClick={() => openRejectDialog(permit)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                        isRejected
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{isRejected ? 'Ubah Alasan Tolak' : 'TIDAK DIBERI IZIN'}</span>
                    </button>

                    {/* TOMBOL SHARE KE GURU PENGAJAR */}
                    {isApproved && onOpenShareTeacher && (
                      <button
                        type="button"
                        onClick={() => onOpenShareTeacher(permit)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share ke Guru</span>
                      </button>
                    )}

                    {/* TOMBOL DIBERI IZIN KELUAR */}
                    <button
                      type="button"
                      onClick={() => handleApprove(permit)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition shadow-md ${
                        isApproved
                          ? 'bg-blue-900 text-white'
                          : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/30 ring-2 ring-blue-500/30'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isApproved ? 'DISETUJUI (KLIK LAGI UNTUK UPDATE)' : 'DIBERI IZIN KELUAR'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {selectedRejectPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Konfirmasi Tidak Diberi Izin Keluar
                </h3>
                <p className="text-xs text-gray-500">
                  Siswa: <span className="font-bold text-gray-800">{selectedRejectPermit.studentName}</span> ({selectedRejectPermit.studentClass})
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Alasan Penolakan dari Waka Kesiswaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan alasan mengapa siswa tidak diizinkan meninggalkan sekolah..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              ></textarea>
              <p className="text-[11px] text-gray-500 mt-1">
                Alasan penolakan ini akan dicantumkan secara otomatis pada pemberitahuan WhatsApp orang tua siswa.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedRejectPermit(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Tetapkan Tidak Diberi Izin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-full">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Hapus Surat Izin yang Telah Di-ACC?
                </h3>
                <p className="text-xs text-gray-500">
                  Surat izin ini akan dihapus permanen dari sistem E-Izin SMANELA.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Nomor Izin:</span>
                <span className="font-mono font-bold text-gray-900">{deleteConfirmPermit.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Siswa:</span>
                <span className="font-bold text-gray-900">{deleteConfirmPermit.studentName} ({deleteConfirmPermit.studentClass})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Keperluan:</span>
                <span className="font-semibold text-gray-800">{deleteConfirmPermit.reasonCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status Waka:</span>
                <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.2 rounded border border-blue-200">DISETUJUI</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmPermit(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeletePermit && deleteConfirmPermit) {
                    onDeletePermit(deleteConfirmPermit.id);
                  }
                  setDeleteConfirmPermit(null);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Surat Izin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
