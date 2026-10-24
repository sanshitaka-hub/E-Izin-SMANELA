import React from 'react';
import { X, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  studentName?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  studentName,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h3>
              {studentName && (
                <p className="text-xs text-gray-500">Izin atas nama siswa: <span className="font-semibold text-gray-700">{studentName}</span></p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Buka gambar di tab baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tutup preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image body */}
        <div className="p-4 bg-gray-950 flex items-center justify-center max-h-[70vh] overflow-auto">
          <img
            src={imageUrl}
            alt="Bukti Perizinan Orang Tua"
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-md border border-gray-800"
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Bukti tangkapan layar chat / surat izin otentik orang tua/wali siswa.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
