import React, { useEffect, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Building2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { ExitPermit } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { generatePermitQRCode } from '../utils/qr';
import SmanelaLogo from './SmanelaLogo';

interface PermitDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  permit: ExitPermit | null;
  onOpenWhatsApp: (permit: ExitPermit) => void;
}

export const PermitDocumentModal: React.FC<PermitDocumentModalProps> = ({
  isOpen,
  onClose,
  permit,
  onOpenWhatsApp,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (permit) {
      generatePermitQRCode(permit).then(setQrCodeDataUrl);
    }
  }, [permit]);

  if (!isOpen || !permit) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `QR-${permit.id}-${permit.studentName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isApproved = permit.status === 'DISETUJUI';
  const isRejected = permit.status === 'DITOLAK';

  const formattedDate = new Date(permit.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Toolbar (no-print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              Dokumen Surat Izin & Kartu Pas Gerbang Digital
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-800 text-blue-100 font-mono font-bold border border-blue-600/50">
              {permit.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenWhatsApp(permit)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold shadow-xs transition"
              title="Kirim ke WhatsApp Ortu"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim WA</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              title="Cetak Dokumen Surat Izin"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letter Body */}
        <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto print-page bg-white text-gray-900">
          {/* KOP SURAT RESMI SMAN 1 LAWANG */}
          <div className="border-b-2 border-black pb-3 mb-5">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Pemprov Jatim / Dinas */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <div className="w-14 h-16 sm:w-16 sm:h-20 border-2 border-blue-900 rounded-lg flex flex-col items-center justify-center p-1 text-center bg-blue-50/70 shadow-2xs">
                  <span className="text-[8.5px] font-bold text-blue-950 leading-tight">PEMPROV</span>
                  <span className="text-[10px] font-black text-blue-800">JATIM</span>
                  <Building2 className="w-5 h-5 text-blue-700 my-0.5" />
                  <span className="text-[6.5px] text-blue-800 font-bold uppercase leading-none">Dinas Pendidikan</span>
                </div>
              </div>

              {/* Teks Kop Surat */}
              <div className="text-center flex-1">
                <h4 className="text-[11px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Pemerintah Provinsi Jawa Timur • Dinas Pendidikan
                </h4>
                <h3 className="text-[11px] sm:text-xs font-bold tracking-wide text-gray-700 uppercase">
                  Cabang Dinas Pendidikan Wilayah Kabupaten Malang
                </h3>
                <h2 className="text-base sm:text-xl font-black text-blue-950 tracking-tight uppercase my-0.5">
                  SMA NEGERI 1 LAWANG
                </h2>
                <p className="text-[10px] sm:text-[11px] font-extrabold text-blue-900 uppercase tracking-widest">
                  "BAKTIKU HARAPANMU"
                </p>
                <p className="text-[9.5px] sm:text-[10.5px] text-gray-600 leading-tight mt-0.5">
                  {SCHOOL_INFO.address}
                </p>
                <p className="text-[9.5px] sm:text-[10.5px] text-gray-600 leading-tight">
                  Telepon: {SCHOOL_INFO.phone} | Website: {SCHOOL_INFO.website} | Email: {SCHOOL_INFO.email}
                </p>
              </div>

              {/* Official Logo SMANELA */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <SmanelaLogo size="lg" />
              </div>
            </div>
            {/* Double decorative rule */}
            <div className="mt-2.5 border-t-2 border-black"></div>
            <div className="mt-0.5 border-t border-black"></div>
          </div>

          {/* JUDUL SURAT & NOMOR */}
          <div className="text-center mb-6">
            <h1 className="text-sm sm:text-base font-extrabold tracking-wide uppercase underline underline-offset-4 decoration-2">
              SURAT IZIN KELUAR LINGKUNGAN SEKOLAH
            </h1>
            <p className="text-xs text-gray-600 mt-1 font-mono">
              Nomor: 421.3 / {permit.id} / SMAN.1.LWG / {new Date().getFullYear()}
            </p>
          </div>

          {/* Status Alert Banner */}
          <div className="mb-5 no-print">
            {isApproved ? (
              <div className="bg-blue-50 border border-blue-300 rounded-xl p-3.5 flex items-center gap-3 text-blue-950 shadow-2xs">
                <CheckCircle2 className="w-6 h-6 text-blue-700 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-blue-950">SURAT IZIN RESMI DISETUJUI</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-700 text-white uppercase tracking-wider">
                      Sah Keluar Kampus
                    </span>
                  </div>
                  <p className="text-xs text-blue-800">
                    Disahkan oleh Waka Kesiswaan ({permit.wakaKesiswaanName}). Tunjukkan QR Code ini kepada Satpam Pos Gerbang Utama.
                  </p>
                </div>
              </div>
            ) : isRejected ? (
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-center gap-3 text-rose-950 shadow-2xs">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-rose-950">PERMOHONAN TIDAK DIBERI IZIN (DITOLAK)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                      Tidak Diizinkan Keluar
                    </span>
                  </div>
                  <p className="text-xs text-rose-800">
                    Siswa tidak diperkenankan meninggalkan sekolah: {permit.wakaNotes || 'Tidak memenuhi kriteria izin.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center gap-3 text-amber-950 shadow-2xs">
                <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <span className="font-extrabold text-sm text-amber-950">MENUNGGU VERIFIKASI WAKA KESISWAAN</span>
                  <p className="text-xs text-amber-800">
                    Permohonan surat izin masih dalam antrean telaah Waka Kesiswaan SMAN 1 Lawang.
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-gray-800 leading-relaxed mb-3">
            Yang bertanda tangan di bawah ini Waka Kesiswaan SMA Negeri 1 Lawang Kabupaten Malang, dengan ini menerangkan bahwa:
          </p>

          {/* TABEL DATA SISWA & PERIZINAN */}
          <div className="border border-gray-300 rounded-lg overflow-hidden mb-5 text-xs sm:text-[13px]">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="w-44 py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">1. Nama Lengkap Siswa</td>
                  <td className="py-2 px-3 font-bold text-gray-950 uppercase">{permit.studentName}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">2. Kelas {permit.nisn ? '/ NISN' : ''}</td>
                  <td className="py-2 px-3 text-gray-900"><strong className="font-sans font-bold text-blue-900">{permit.studentClass}</strong> {permit.nisn ? `(${permit.nisn})` : ''}</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">3. Nama Orang Tua / Wali</td>
                  <td className="py-2 px-3 text-gray-900 font-semibold">{permit.parentName}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">4. No. Handphone (WhatsApp) Ortu</td>
                  <td className="py-2 px-3 text-gray-900 font-mono">
                    {permit.parentPhone}
                    {permit.whatsappSent && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                        Notifikasi Terkirim
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">5. Alasan Keluar (Keperluan)</td>
                  <td className="py-2 px-3 text-gray-900">
                    <span className="font-semibold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs mr-1">
                      {permit.reasonCategory}
                    </span>
                    <span className="italic">{permit.reasonDetail}</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">6. Rencana Waktu Keluar</td>
                  <td className="py-2 px-3 text-gray-900 font-semibold font-mono">
                    Pukul {permit.timeOut} WIB (Hari {formattedDate})
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">7. Estimasi Jam Kembali</td>
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    {permit.isReturning && permit.estimatedReturnTime ? (
                      <span className="text-blue-900 font-bold font-mono">
                        Wajib kembali ke sekolah sebelum pukul {permit.estimatedReturnTime} WIB
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Izin pulang / tidak kembali ke sekolah hari ini.</span>
                    )}
                  </td>
                </tr>
                {permit.wakaNotes && (
                  <tr className="bg-amber-50/40">
                    <td className="py-2 px-3 font-semibold text-gray-700 border-r border-gray-200">8. Catatan / Memo Kesiswaan</td>
                    <td className="py-2 px-3 text-gray-800 italic">"{permit.wakaNotes}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs sm:text-[13px] text-gray-800 leading-relaxed mb-6">
            Demikian surat izin ini dibuat untuk dapat dipergunakan sebagaimana mestinya dan ditunjukkan kepada Petugas Satpam/Piket Gerbang SMA Negeri 1 Lawang saat keluar maupun kembali ke lingkungan sekolah.
          </p>

          {/* BOTTOM SIGNATURE & QR CODE SECTION */}
          <div className="grid grid-cols-2 gap-4 items-end mt-4 pt-4 border-t border-gray-200">
            {/* Left: QR Code Verification Badge */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code Surat Izin"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-white p-1 border border-blue-400 shadow-xs"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-400">
                  Membuat QR...
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-950">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>QR Verifikasi Satpam</span>
                </div>
                <p className="text-[10px] text-gray-600 font-mono font-semibold leading-tight">
                  ID: {permit.id}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Pindai QR ini di Pos Gerbang SMANELA untuk verifikasi keaslian surat izin.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="no-print mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 hover:text-blue-950 bg-white px-2 py-0.5 rounded border border-blue-300 hover:bg-blue-50 transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh QR</span>
                </button>
              </div>
            </div>

            {/* Right: Official Signature & Digital Stamp */}
            <div className="text-center relative">
              <p className="text-xs text-gray-700">
                Lawang, {new Date(permit.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs font-bold text-gray-900">
                Waka Kesiswaan SMAN 1 Lawang
              </p>

              {/* Digital Stamp Simulation with Official SMANELA Seal */}
              <div className="relative h-20 flex items-center justify-center my-1">
                {/* Round Stamp watermark in traditional blue official seal ink */}
                <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-blue-700/80 text-blue-800 flex flex-col items-center justify-center p-1 transform -rotate-12 pointer-events-none select-none bg-blue-600/5">
                  <span className="text-[6.5px] font-black tracking-widest uppercase">SMA NEGERI 1 LAWANG</span>
                  <span className="text-[5.5px] font-black text-amber-800">BAKTIKU HARAPANMU</span>
                  <span className="text-[9px] font-extrabold my-0.5 text-blue-900">KESISWAAN</span>
                  <span className="text-[6px] font-medium text-blue-700">KAB. MALANG</span>
                </div>

                {/* Digital Signature scribble */}
                <div className="font-serif italic text-blue-950 font-bold text-xl tracking-wider select-none z-10 transform -rotate-2">
                  Bambang I.
                </div>
              </div>

              <p className="text-xs font-bold text-gray-950 underline underline-offset-2">
                {permit.wakaKesiswaanName}
              </p>
              <p className="text-[11px] text-gray-600 font-mono">
                NIP. {permit.wakaNip || '19680512 199303 1 008'}
              </p>
            </div>
          </div>

          {/* Footer notice */}
          <div className="mt-6 pt-2 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center font-mono">
            <span>Sistem E-Izin SMAN 1 Lawang • BAKTIKU HARAPANMU • QR Verified</span>
            <span>Doc Token: {permit.verificationToken}</span>
          </div>
        </div>

        {/* Modal Bottom Controls (no-print) */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Dokumen resmi siap dicetak langsung atau disimpan format PDF.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenWhatsApp(permit)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kirim ke WA Ortu ({permit.parentName})</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
