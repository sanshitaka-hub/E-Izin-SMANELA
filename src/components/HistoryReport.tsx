import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  Printer,
  ChevronDown,
  Trash2,
  CalendarClock
} from 'lucide-react';
import { ExitPermit } from '../types';
import { SMANELA_CLASSES } from '../data/mockData';
import { getDaysRemaining } from '../utils/permitCleanup';

interface HistoryReportProps {
  permits: ExitPermit[];
  onViewDocument: (permit: ExitPermit) => void;
  onOpenWhatsApp: (permit: ExitPermit) => void;
  onPreviewImage: (imageUrl: string, title: string, studentName: string) => void;
  onResetData: () => void;
  onDeletePermit?: (permitId: string) => void;
  onDeleteAllApproved?: () => void;
  onCleanupExpired?: () => void;
}

export const HistoryReport: React.FC<HistoryReportProps> = ({
  permits,
  onViewDocument,
  onOpenWhatsApp,
  onPreviewImage,
  onResetData,
  onDeletePermit,
  onDeleteAllApproved,
  onCleanupExpired,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredPermits = permits.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' ? true : p.studentClass === selectedClass;
    const matchesStatus = selectedStatus === 'ALL' ? true : p.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const exportCSV = () => {
    const headers = [
      'Nomor Izin',
      'Tanggal',
      'Nama Siswa',
      'NISN',
      'Kelas',
      'Nama Orang Tua',
      'Nomor HP Orang Tua',
      'Kategori Keperluan',
      'Rincian Alasan',
      'Jam Keluar',
      'Estimasi Kembali',
      'Waka Kesiswaan',
      'Status Izin',
      'Catatan Waka',
      'Status WhatsApp',
      'Jam Checkout Gerbang'
    ];

    const rows = filteredPermits.map((p) => [
      `"${p.id}"`,
      `"${p.date}"`,
      `"${p.studentName}"`,
      `"${p.nisn || '-'}"`,
      `"${p.studentClass}"`,
      `"${p.parentName}"`,
      `"${p.parentPhone}"`,
      `"${p.reasonCategory}"`,
      `"${p.reasonDetail.replace(/"/g, '""')}"`,
      `"${p.timeOut}"`,
      `"${p.estimatedReturnTime || '-'}"`,
      `"${p.wakaKesiswaanName}"`,
      `"${p.status}"`,
      `"${(p.wakaNotes || '-').replace(/"/g, '""')}"`,
      `"${p.whatsappSent ? 'Terkirim' : 'Belum'}"`,
      `"${p.gateCheckedOutAt ? new Date(p.gateCheckedOutAt).toLocaleTimeString('id-ID') : '-'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Izin_Keluar_SMANELA_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">
            Rekapitulasi & Riwayat Perizinan Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Arsip lengkap izin keluar siswa SMAN 1 Lawang untuk BK, Kesiswaan, dan Wali Kelas.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
            <CalendarClock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auto-Hapus: 10 Hari Aktif</span>
          </div>

          {onDeleteAllApproved && (
            <button
              type="button"
              onClick={onDeleteAllApproved}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Hapus seluruh surat izin yang telah disetujui"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus Semua Izin ACC</span>
            </button>
          )}

          {onCleanupExpired && (
            <button
              type="button"
              onClick={onCleanupExpired}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Bersihkan surat izin yang melebihi batas 10 hari"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Cek Kedaluwarsa 10 Hari</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetData}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="Reset ke data awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs shadow-blue-800/20"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari siswa, nomor izin, keperluan, orang tua..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
          >
            <option value="ALL">Semua Kelas</option>
            {SMANELA_CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
          >
            <option value="ALL">Semua Status</option>
            <option value="MENUNGGU">Menunggu Persetujuan</option>
            <option value="DISETUJUI">Diberi Izin</option>
            <option value="DITOLAK">Tidak Diberi Izin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 border-collapse">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-200 tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Izin & Waktu</th>
                <th className="py-3 px-4">Siswa & Kelas</th>
                <th className="py-3 px-4">Orang Tua & HP</th>
                <th className="py-3 px-4">Keperluan Keluar</th>
                <th className="py-3 px-4">Bukti Ortu</th>
                <th className="py-3 px-4 text-center">Status Waka</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPermits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Tidak ada data riwayat yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredPermits.map((permit) => (
                  <tr key={permit.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-gray-900 block text-[11px]">
                        {permit.id}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {permit.date} • {permit.timeOut} WIB
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                        Sisa: {getDaysRemaining(permit)} hari
                      </span>
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-950 block uppercase">
                        {permit.studentName}
                      </span>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                        {permit.studentClass}
                      </span>
                    </td>

                    {/* Parent */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-gray-900 block">{permit.parentName}</span>
                      <span className="font-mono text-[11px] text-blue-800 font-semibold">{permit.parentPhone}</span>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-[10px] font-bold text-blue-950 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 block w-fit mb-0.5">
                        {permit.reasonCategory}
                      </span>
                      <span className="text-gray-600 line-clamp-2">{permit.reasonDetail}</span>
                    </td>

                    {/* Proof */}
                    <td className="py-3.5 px-4">
                      {permit.hasParentProof && permit.parentProofImage ? (
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewImage(
                              permit.parentProofImage!,
                              'Bukti Screenshot Perizinan Orang Tua',
                              permit.studentName
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-900 text-[11px] font-medium border border-gray-200 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Foto</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Tanpa Foto</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {permit.status === 'DISETUJUI' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                          <CheckCircle className="w-3 h-3 text-blue-700" />
                          <span>Diberi Izin</span>
                        </span>
                      ) : permit.status === 'DITOLAK' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Ditolak</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Menunggu</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenWhatsApp(permit)}
                          className="p-1.5 text-gray-500 hover:text-[#25d366] hover:bg-emerald-50 rounded-lg transition"
                          title="Kirim / Cek Pesan WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewDocument(permit)}
                          className="p-1.5 text-gray-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat Surat & QR Code"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {onDeletePermit && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus surat izin ${permit.id} (${permit.studentName})?\n\nTindakan ini permanen dan menghapus catatan izin dari sistem.`)) {
                                onDeletePermit(permit.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Surat Izin Ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
