import React, { useState } from 'react';
import { 
  Send, 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Phone, 
  FileText, 
  Shield, 
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { ExitPermit, ExitCategory } from '../types';
import { 
  DEFAULT_WAKA, 
  SAMPLE_CHAT_PROOF_SVG, 
  SAMPLE_CHAT_PROOF_FAMILY_SVG,
  SCHOOL_INFO 
} from '../data/mockData';
import { SmanelaLogo } from './SmanelaLogo';
import { sounds } from '../utils/audio';

interface PermitFormProps {
  onPermitCreated: (newPermit: ExitPermit) => void;
  wakaName: string;
}

export const PermitForm: React.FC<PermitFormProps> = ({ onPermitCreated, wakaName }) => {
  // Manual text states
  const [studentName, setStudentName] = useState('');
  const [nisn, setNisn] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [reasonCategory, setReasonCategory] = useState<ExitCategory>('Sakit / Periksa Medis');
  const [reasonDetail, setReasonDetail] = useState('');
  const [timeOut, setTimeOut] = useState('09:30');
  const [isReturning, setIsReturning] = useState(true);
  const [estimatedReturnTime, setEstimatedReturnTime] = useState('11:30');
  const [currentWakaName, setCurrentWakaName] = useState(wakaName || DEFAULT_WAKA.name);

  // Screenshot proof state (Opsional)
  const [hasParentProof, setHasParentProof] = useState<boolean>(false);
  const [proofImage, setProofImage] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Validation / errors
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image upload from file input
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Mohon unggah file gambar (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProofImage(result);
      setProofFileName(file.name);
      setHasParentProof(true);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Quick preset loader
  const loadPreset = (type: 'sakit' | 'keluarga') => {
    if (type === 'sakit') {
      setStudentName('Muhammad Alif Pratama');
      setNisn('0078912345');
      setStudentClass('XI-2');
      setParentName('Ibu Siti Nurhaliza');
      setParentPhone('081234567890');
      setReasonCategory('Sakit / Periksa Medis');
      setReasonDetail('Pemeriksaan lanjutan gigi bengkak di Puskesmas Lawang dengan didampingi wali.');
      setTimeOut('09:45');
      setIsReturning(true);
      setEstimatedReturnTime('11:45');
      setHasParentProof(true);
      setProofImage(SAMPLE_CHAT_PROOF_SVG);
      setProofFileName('screenshot_chat_wa_ibu_siti.png');
    } else {
      setStudentName('Nabila Putri Kirana');
      setNisn('0067823411');
      setStudentClass('XII MIPA 3');
      setParentName('Bapak Joko Susilo');
      setParentPhone('081398765432');
      setReasonCategory('Keperluan Keluarga Mendesak');
      setReasonDetail('Menjemput dokumen penting dan mendampingi adik yang sakit.');
      setTimeOut('10:15');
      setIsReturning(false);
      setEstimatedReturnTime('');
      setHasParentProof(false);
      setProofImage('');
      setProofFileName('');
    }
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi field manual
    if (!studentName.trim()) {
      setErrorMsg('Mohon isi nama lengkap siswa.');
      return;
    }
    if (!studentClass.trim()) {
      setErrorMsg('Mohon isi kelas siswa secara manual (contoh: XI-2, X-1, XII MIPA 1).');
      return;
    }
    if (!parentName.trim()) {
      setErrorMsg('Mohon isi nama orang tua / wali.');
      return;
    }
    if (!parentPhone.trim()) {
      setErrorMsg('Mohon isi nomor HP WhatsApp orang tua.');
      return;
    }
    if (!reasonDetail.trim()) {
      setErrorMsg('Mohon tuliskan keperluan / alasan keluar sekolah.');
      return;
    }
    if (hasParentProof && !proofImage) {
      setErrorMsg('Anda memilih opsi melampirkan foto. Silakan unggah gambar atau pilih opsi "Tanpa Bukti Foto".');
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `IZN-SMANELA-2026-${randomSuffix}`;
    const token = `v-smanela-${Math.random().toString(36).substring(2, 9)}`;

    const newPermit: ExitPermit = {
      id: newId,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      timeOut,
      estimatedReturnTime: isReturning ? estimatedReturnTime : undefined,
      isReturning,
      studentName: studentName.trim(),
      nisn: nisn.trim() || undefined,
      studentClass: studentClass.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      reasonCategory,
      reasonDetail: reasonDetail.trim(),
      hasParentProof,
      parentProofImage: hasParentProof ? proofImage : undefined,
      parentProofFileName: hasParentProof ? (proofFileName || 'screenshot_perizinan_ortu.png') : undefined,
      wakaKesiswaanName: currentWakaName.trim() || DEFAULT_WAKA.name,
      wakaNip: DEFAULT_WAKA.nip,
      status: 'MENUNGGU',
      whatsappSent: false,
      verificationToken: token,
    };

    setTimeout(() => {
      onPermitCreated(newPermit);
      sounds.playSuccess();
      setIsSubmitting(false);

      // Reset form fields
      setStudentName('');
      setNisn('');
      setStudentClass('');
      setParentName('');
      setParentPhone('');
      setReasonDetail('');
      setProofImage('');
      setProofFileName('');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* SMANELA Blue Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-800/60">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-800/80 border border-amber-400/40 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SMANELA • "{SCHOOL_INFO.motto.toUpperCase()}"</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Formulir Izin Keluar Sekolah Siswa
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl leading-relaxed">
              Pengisian data izin manual resmi SMAN 1 Lawang. Setiap permohonan menghasilkan kode QR terverifikasi Waka Kesiswaan dan pemberitahuan otomatis ke WhatsApp orang tua.
            </p>

            <div className="mt-4 pt-3 border-t border-blue-800/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-amber-300 font-semibold">Isi Cepat Demo:</span>
              <button
                type="button"
                onClick={() => loadPreset('sakit')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition border border-white/20"
              >
                💊 Siswa Sakit (Ada Bukti)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('keluarga')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition border border-white/20"
              >
                🏠 Urusan Keluarga (Tanpa Bukti)
              </button>
            </div>
          </div>

          <div className="hidden sm:block shrink-0">
            <SmanelaLogo size="xl" />
          </div>
        </div>
      </div>

      {/* Main Manual Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 sm:p-8">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Mohon Lengkapi Isian</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: DATA SISWA & KELAS (MANUAL) */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-blue-100 text-blue-900 font-bold text-sm">
              <User className="w-4 h-4 text-blue-700" />
              <span>1. IDENTITAS SISWA & KELAS (INPUT MANUAL)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ketik nama lengkap siswa..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Kelas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="Contoh: XI-2, XII MIPA 1"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  NISN (Opsional)
                </label>
                <input
                  type="text"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="Nomor Induk Siswa..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DATA ORANG TUA & NOMOR WHATSAPP (MANUAL) */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-blue-100 text-blue-900 font-bold text-sm">
              <Phone className="w-4 h-4 text-blue-700" />
              <span>2. DATA ORANG TUA & NOMOR HP WHATSAPP (INPUT MANUAL)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Ketik nama orang tua / wali..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Nomor HP Orang Tua (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                />
                <p className="text-[11px] text-blue-800 font-medium mt-1">
                  Notifikasi otomatis surat izin akan dikirim ke nomor WhatsApp ini.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: ALASAN KELUAR (KEPERLUAN APA?) & WAKTU */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-blue-100 text-blue-900 font-bold text-sm">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>3. ALASAN KELUAR (KEPERLUAN APA?) & JADWAL KELUAR</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Kategori Keperluan Keluar <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Sakit / Periksa Medis',
                      'Keperluan Keluarga Mendesak',
                      'Tugas / Lomba Mewakili Sekolah',
                      'Pengurusan Berkas / Dokumen Resmi',
                      'Lainnya',
                    ] as ExitCategory[]
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setReasonCategory(cat)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border transition ${
                        reasonCategory === cat
                          ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Penjelasan Rinci Alasan / Keperluan Keluar <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reasonDetail}
                  onChange={(e) => setReasonDetail(e.target.value)}
                  placeholder="Ketik keperluan atau alasan lengkap keluar sekolah..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                ></textarea>
              </div>

              {/* Time Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Jam Keluar (WIB) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center gap-2 mt-2 sm:mt-6">
                    <input
                      type="checkbox"
                      id="isReturningCheck"
                      checked={isReturning}
                      onChange={(e) => setIsReturning(e.target.checked)}
                      className="w-4 h-4 text-blue-700 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="isReturningCheck" className="text-xs font-semibold text-gray-800 cursor-pointer">
                      Siswa akan kembali lagi ke sekolah hari ini?
                    </label>
                  </div>

                  {isReturning && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 shrink-0">Estimasi Jam Kembali:</span>
                      <input
                        type="time"
                        value={estimatedReturnTime}
                        onChange={(e) => setEstimatedReturnTime(e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: OPSI BUKTI SCREENSHOT PERIZINAN DARI ORANG TUA */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-100 text-blue-900 font-bold text-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-700" />
                <span>4. BUKTI FOTO PERIZINAN ORANG TUA (OPSIONAL)</span>
              </div>
              <span className="text-gray-500 text-xs font-semibold">Bisa dipilih / Tidak wajib</span>
            </div>

            {/* Selector: Ingin kirim foto atau tidak */}
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 mb-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Apakah ingin melampirkan bukti foto chat / surat orang tua?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setHasParentProof(false);
                    setProofImage('');
                    setProofFileName('');
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    !hasParentProof
                      ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${!hasParentProof ? 'bg-amber-400' : 'bg-gray-400'}`}></span>
                  <span>Tidak (Tanpa Foto / Izin Lisan & Telepon)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasParentProof(true);
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    hasParentProof
                      ? 'bg-blue-800 text-white border-blue-900 shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-blue-800 border-gray-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${hasParentProof ? 'bg-amber-300' : 'bg-gray-400'}`}></span>
                  <span>Ya, Kirim Bukti Foto Screenshot Chat Ortu</span>
                </button>
              </div>
            </div>

            {/* If NOT attaching photo */}
            {!hasParentProof && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <span className="text-base">ℹ️</span>
                <div>
                  <p className="font-bold">Opsi Tanpa Lampiran Foto Aktif</p>
                  <p className="text-amber-800 mt-0.5">
                    Data izin tetap sah diajukan dan diproses Waka Kesiswaan. Waka Kesiswaan atau piket dapat memverifikasi via panggilan telepon ke nomor orang tua siswa.
                  </p>
                </div>
              </div>
            )}

            {/* If attaching photo */}
            {hasParentProof && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : proofImage
                    ? 'border-blue-400 bg-blue-50/40'
                    : 'border-blue-300 hover:border-blue-500 bg-blue-50/20'
                }`}
              >
                {proofImage ? (
                  <div className="space-y-3">
                    <div className="relative inline-block max-w-sm rounded-xl overflow-hidden border border-blue-300 shadow-md">
                      <img
                        src={proofImage}
                        alt="Bukti Screenshot Ortu"
                        className="max-h-52 w-auto object-contain mx-auto bg-gray-900"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setProofImage('');
                            setProofFileName('');
                          }}
                          className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow transition"
                          title="Hapus gambar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-blue-900 font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700" />
                      <span>File terlampir: {proofFileName || 'screenshot_perizinan.png'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-11 h-11 mx-auto rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        Tarik & lepas file screenshot chat WhatsApp perizinan orang tua di sini
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Format PNG, JPG, JPEG, WEBP (Maksimal 8 MB)
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                      <label className="cursor-pointer px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-xs transition">
                        <span>Pilih File Dari Perangkat</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setProofImage(SAMPLE_CHAT_PROOF_SVG);
                          setProofFileName('contoh_chat_wa_ibu_siti.png');
                        }}
                        className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold rounded-xl transition"
                      >
                        📎 Gunakan Contoh Screenshot WA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: NAMA WAKA KESISWAAN (MANUAL) */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-blue-100 text-blue-900 font-bold text-sm">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>5. NAMA WAKA KESISWAAN (INPUT MANUAL)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Nama Waka Kesiswaan Penanggung Jawab <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentWakaName}
                  onChange={(e) => setCurrentWakaName(e.target.value)}
                  placeholder="Ketik nama Waka Kesiswaan..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                />
              </div>

              <div className="flex items-end">
                <p className="text-xs text-gray-500 pb-2">
                  Nama Waka Kesiswaan akan tercetak secara resmi pada surat izin keluar dan pesan WhatsApp orang tua.
                </p>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              * Pengajuan manual akan langsung menghasilkan QR Code dan masuk ke Meja Persetujuan Waka Kesiswaan.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Memproses QR Code & Pengajuan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Kirim Pengajuan Surat Izin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
