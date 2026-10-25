import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  CheckCheck, 
  Copy, 
  ExternalLink, 
  GraduationCap, 
  Send, 
  Check, 
  Users,
  BookOpen
} from 'lucide-react';
import { ExitPermit } from '../types';
import { generateTeacherShareMessage, getGeneralWhatsAppShareUrl } from '../utils/whatsapp';
import { copyToClipboard } from '../utils/clipboard';

interface ShareTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  permit: ExitPermit | null;
  onMarkShared: (permitId: string, teacherName: string) => void;
}

export const ShareTeacherModal: React.FC<ShareTeacherModalProps> = ({
  isOpen,
  onClose,
  permit,
  onMarkShared,
}) => {
  const [teacherName, setTeacherName] = useState('Guru Mapel / Wali Kelas ' + (permit?.studentClass || ''));
  const [teacherPhone, setTeacherPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !permit) return null;

  const message = generateTeacherShareMessage(permit, teacherName);
  const shareUrl = getGeneralWhatsAppShareUrl(message, teacherPhone);

  const handleCopy = async () => {
    await copyToClipboard(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWA = () => {
    onMarkShared(permit.id, teacherName);
    setIsSent(true);
  };

  const handleSimulateMark = () => {
    onMarkShared(permit.id, teacherName);
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Share Dispensasi ke Guru Pengajar</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900 text-emerald-200 uppercase">
                  Waka Kesiswaan
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Meneruskan informasi izin siswa yang disahkan ke Guru Mapel / Wali Kelas SMANELA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Target Student info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Siswa Diberi Izin:</span>
              <p className="font-extrabold text-sm text-gray-900 uppercase">
                {permit.studentName} <span className="font-mono text-emerald-700">({permit.studentClass})</span>
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Jam Keluar: <strong>{permit.timeOut} WIB</strong> • Alasan: {permit.reasonCategory}
              </p>
            </div>
            {permit.sharedToTeacher && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-300">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Pernah Di-share</span>
              </span>
            )}
          </div>

          {/* Form input: Target Guru */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Tujuan Guru / Wali Kelas
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Contoh: Guru Matematika / Wali Kelas"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                No. HP Guru (Opsional)
              </label>
              <input
                type="tel"
                value={teacherPhone}
                onChange={(e) => setTeacherPhone(e.target.value)}
                placeholder="Kosongkan jika share ke grup/pilih kontak"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Preview Pesan WhatsApp untuk Guru:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
              </button>
            </div>

            <div className="bg-[#efeae2] p-4 rounded-xl border border-gray-300">
              <div className="bg-white rounded-lg p-3.5 shadow-xs text-xs sm:text-[13px] text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {message}
              </div>
            </div>
          </div>

          {isSent && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Status share ke guru pengajar berhasil dicatat dalam log sistem.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSimulateMark}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tandai Terkirim</span>
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSendWA}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka WhatsApp & Share</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
