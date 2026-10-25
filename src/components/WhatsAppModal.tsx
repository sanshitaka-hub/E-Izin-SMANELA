import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCheck, 
  Copy, 
  Smartphone, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ExitPermit } from '../types';
import { generateWhatsAppMessage, getWhatsAppUrl, sanitizePhoneNumber } from '../utils/whatsapp';

import { copyToClipboard } from '../utils/clipboard';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  permit: ExitPermit | null;
  onMarkAsSent: (permitId: string, message: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  permit,
  onMarkAsSent,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !permit) return null;

  const sanitizedPhone = sanitizePhoneNumber(permit.parentPhone);
  const message = generateWhatsAppMessage(permit);
  const waUrl = getWhatsAppUrl(permit.parentPhone, message);

  const handleCopy = async () => {
    await copyToClipboard(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateAutomatedGateway = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSentSuccess(true);
      onMarkAsSent(permit.id, message);
      setTimeout(() => {
        setSentSuccess(false);
      }, 3000);
    }, 1200);
  };

  const handleOpenWhatsApp = () => {
    onMarkAsSent(permit.id, message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Branded Header */}
        <div className="bg-[#005c4b] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-inner font-bold">
              <MessageSquare className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Pengiriman Pesan Otomatis WhatsApp</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#128c7e] text-emerald-100 uppercase tracking-wide">
                  Gateway Ortu
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Pemberitahuan resmi izin keluar sekolah kepada orang tua / wali siswa
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

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Target Info Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {permit.parentName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Penerima Pesan:</p>
                <p className="font-bold text-gray-900 text-sm">
                  {permit.parentName} <span className="text-xs text-gray-500 font-normal">(Orang Tua / Wali {permit.studentName})</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 font-mono text-xs text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                    <Smartphone className="w-3 h-3" />
                    +{sanitizedPhone}
                  </span>
                  <span className="text-xs text-gray-500">Kelas: {permit.studentClass}</span>
                </div>
              </div>
            </div>

            {permit.whatsappSent ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 px-3 py-1.5 rounded-lg shadow-2xs">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Pernah Terkirim</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Belum Terkirim</span>
              </div>
            )}
          </div>

          {/* Success Banner if simulated */}
          {sentSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs font-medium animate-fadeIn">
              <Check className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold">Notifikasi Berhasil Dikirim ke Gateway WhatsApp!</p>
                <p className="text-emerald-700">Status surat izin dan pesan tersimpan di log sistem SMAN 1 Lawang.</p>
              </div>
            </div>
          )}

          {/* WhatsApp Chat Preview Bubble */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Preview Teks Pesan WhatsApp SMANELA:
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>

            {/* Chat bubble visual background */}
            <div className="bg-[#efeae2] p-4 rounded-xl border border-gray-300 relative shadow-inner overflow-hidden">
              <div className="max-w-xl mx-auto bg-white rounded-lg p-4 shadow-sm border border-emerald-100 text-gray-800 font-sans text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap select-text">
                {message}
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-end gap-1 text-[11px] text-gray-400 font-mono">
                  <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Pesan WhatsApp ini mencantumkan detail status persetujuan resmi dari Waka Kesiswaan <strong>({permit.wakaKesiswaanName})</strong> serta catatan dan jam perizinan agar orang tua selalu terinformasi secara transparan.
            </p>
          </div>
        </div>

        {/* Footer actions */}
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
              onClick={handleSimulateAutomatedGateway}
              disabled={isSimulating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Mengirim via Gateway...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Otomatis (Gateway)</span>
                </>
              )}
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold shadow-md shadow-[#25d366]/20 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka WhatsApp Web/App</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
