import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  LogOut, 
  LogIn, 
  User, 
  FileText, 
  RefreshCw,
  CameraOff,
  Eye,
  Check,
  Shield
} from 'lucide-react';
import jsQR from 'jsqr';
import { ExitPermit } from '../types';
import { parseQRCodeData } from '../utils/qr';
import { sounds } from '../utils/audio';

interface GateScannerProps {
  permits: ExitPermit[];
  onCheckOut: (permitId: string, guardName: string) => void;
  onCheckIn: (permitId: string, guardName: string) => void;
  onViewDocument: (permit: ExitPermit) => void;
  onOpenWhatsApp: (permit: ExitPermit) => void;
  onPreviewImage: (imageUrl: string, title: string, studentName: string) => void;
}

export const GateScanner: React.FC<GateScannerProps> = ({
  permits,
  onCheckOut,
  onCheckIn,
  onViewDocument,
  onOpenWhatsApp,
  onPreviewImage,
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'manual'>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [manualId, setManualId] = useState('');
  const [scannedPermit, setScannedPermit] = useState<ExitPermit | null>(null);
  const [guardName, setGuardName] = useState('Pak Sugiono (Satpam Pos 1)');
  const [scanMessage, setScanMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream cleanly
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Start camera stream for live scanning
  const startCamera = async () => {
    setCameraError('');
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError('Browser tidak mendukung akses kamera langsung pada konteks ini. Silakan gunakan mode Unggah Gambar QR atau Input Nomor Izin Manual.');
      setIsScanning(false);
      return;
    }

    try {
      stopCamera();
      const constraints = {
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        scanVideoFrame();
      }
    } catch (err: unknown) {
      // Tangani penolakan izin kamera secara halus tanpa melempar uncaught exception
      const errorMsg = (err instanceof Error) ? err.message : String(err);
      console.warn('Izin kamera ditolak atau tidak tersedia:', errorMsg);
      setCameraError('Izin akses kamera belum diberikan atau tidak diizinkan oleh browser/lingkungan saat ini. Jangan khawatir, Anda tetap dapat memverifikasi QR dengan mengklik tab "Unggah Gambar QR" atau ketik kode di "Input Manual".');
      setIsScanning(false);
    }
  };

  // Video scanning loop
  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleRawQRResult(code.data);
        stopCamera();
        return;
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
  };

  // Handle uploaded QR image
  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleRawQRResult(code.data);
          } else {
            setScanMessage('Tidak ditemukan kode QR yang valid pada gambar yang diunggah.');
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRawQRResult = (data: string) => {
    sounds.playScan();
    const parsed = parseQRCodeData(data);
    if (parsed.permitId) {
      findAndSetPermit(parsed.permitId);
    } else {
      setScanMessage(`Data QR tidak dikenali sebagai format resmi SMAN 1 Lawang: "${data.substring(0, 30)}..."`);
    }
  };

  const findAndSetPermit = (id: string) => {
    const cleanId = id.trim().toUpperCase();
    const found = permits.find((p) => p.id.toUpperCase() === cleanId || p.id.includes(cleanId));
    if (found) {
      setScannedPermit(found);
      setScanMessage('');
      if (found.status === 'DISETUJUI') {
        sounds.playSuccess();
      } else {
        sounds.playReject();
      }
    } else {
      setScannedPermit(null);
      setScanMessage(`Nomor izin "${cleanId}" tidak ditemukan dalam sistem database SMAN 1 Lawang.`);
      sounds.playReject();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCheckOut = () => {
    if (!scannedPermit) return;
    onCheckOut(scannedPermit.id, guardName);
    sounds.playSuccess();
    // Update local state copy
    setScannedPermit({
      ...scannedPermit,
      gateCheckedOutAt: new Date().toISOString(),
      securityGuardName: guardName,
    });
  };

  const handleCheckIn = () => {
    if (!scannedPermit) return;
    onCheckIn(scannedPermit.id, guardName);
    sounds.playSuccess();
    setScannedPermit({
      ...scannedPermit,
      gateCheckedInAt: new Date().toISOString(),
      securityGuardName: guardName,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-800/80 border border-blue-500/40 flex items-center justify-center text-amber-300 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Pos Satpam & Keamanan Kampus
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-800 text-blue-200 font-semibold border border-blue-700/60">
                Gerbang Utama SMANELA
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black">
              Pemindai Verifikasi QR Code Keluar Sekolah
            </h1>
            <p className="text-xs text-blue-200/80">
              Validasi real-time status persetujuan Waka Kesiswaan & pencatatan jam checkout siswa.
            </p>
          </div>
        </div>

        {/* Guard on duty */}
        <div className="bg-blue-950/80 border border-blue-700/60 p-3 rounded-xl flex items-center gap-2.5">
          <User className="w-4 h-4 text-blue-300" />
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-300 block">Petugas Bertugas:</span>
            <input
              type="text"
              value={guardName}
              onChange={(e) => setGuardName(e.target.value)}
              className="text-xs font-bold text-white bg-transparent border-b border-blue-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-blue-100 shadow-xs flex items-center gap-2">
        <button
          onClick={() => {
            stopCamera();
            setActiveMode('manual');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeMode === 'manual'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Input Cepat / Cari Surat</span>
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveMode('upload');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeMode === 'upload'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Gambar QR</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('camera');
            startCamera();
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeMode === 'camera'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-950'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Kamera Live Scanner</span>
        </button>
      </div>

      {/* SCANNER INPUT INTERFACE */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
        {/* Mode: Manual Input */}
        {activeMode === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Masukkan Nomor Registrasi Izin / Scan Barcode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && findAndSetPermit(manualId)}
                  placeholder="Contoh: IZN-SMANELA-2026-0088 atau klik tombol di bawah..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700"
                />
                <button
                  type="button"
                  onClick={() => findAndSetPermit(manualId)}
                  className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari & Verifikasi</span>
                </button>
              </div>
            </div>

            {/* Quick Test Picker for Evaluator */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Pilih Cepat Pengajuan Siswa untuk Diuji di Pos Gerbang:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {permits.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setManualId(p.id);
                      findAndSetPermit(p.id);
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/50 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-gray-700 group-hover:text-blue-900">
                        {p.id}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        p.status === 'DISETUJUI'
                          ? 'bg-blue-100 text-blue-900 font-bold'
                          : p.status === 'DITOLAK'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1 truncate">{p.studentName}</p>
                    <p className="text-[10px] text-gray-500">{p.studentClass} • {p.timeOut} WIB</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode: Upload File */}
        {activeMode === 'upload' && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl space-y-3">
            <Upload className="w-10 h-10 text-blue-700 mx-auto" />
            <div>
              <p className="text-sm font-bold text-gray-800">
                Unggah Screenshot atau Foto Kode QR Siswa
              </p>
              <p className="text-xs text-gray-500">
                Sistem akan secara otomatis membaca dan memverifikasi data izin
              </p>
            </div>
            <label className="inline-block cursor-pointer px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-xs">
              <span>Pilih Gambar QR</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        )}

        {/* Mode: Live Camera Scanner */}
        {activeMode === 'camera' && (
          <div className="space-y-3">
            {cameraError ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Kamera Tidak Aktif</p>
                  <p>{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-2 px-3 py-1 bg-rose-700 text-white rounded-lg text-xs font-bold"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-lg mx-auto flex items-center justify-center border-4 border-emerald-600">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target overlay reticle */}
                <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-emerald-400 rounded-xl relative shadow-2xl animate-pulse">
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400"></div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                  <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xs">
                    Arahkan kamera ke QR Code Surat Izin SMANELA
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={isScanning ? stopCamera : startCamera}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {isScanning ? (
                  <>
                    <CameraOff className="w-3.5 h-3.5" />
                    <span>Jeda Kamera</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Nyalakan Kamera</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Scan Message / Error */}
        {scanMessage && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* VERIFICATION RESULT CARD */}
      {scannedPermit && (
        <div className="animate-fadeIn space-y-4">
          {scannedPermit.status === 'DISETUJUI' ? (
            /* GREEN PASS: OFFICIALLY APPROVED */
            <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl overflow-hidden">
              {/* Top Banner */}
              <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black shadow">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-100 bg-emerald-800/60 px-2 py-0.5 rounded">
                      VERIFIKASI LOLOS
                    </span>
                    <h2 className="text-lg sm:text-xl font-black mt-0.5">
                      SURAT IZIN KELUAR RESMI & SAH
                    </h2>
                    <p className="text-xs text-emerald-100">
                      Disetujui oleh Waka Kesiswaan ({scannedPermit.wakaKesiswaanName})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs bg-emerald-800 px-2 py-1 rounded text-emerald-200 block font-bold">
                    {scannedPermit.id}
                  </span>
                  <span className="text-[11px] text-emerald-100">
                    Jam Keluar: {scannedPermit.timeOut} WIB
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-800 uppercase">Nama Siswa:</p>
                    <p className="text-xl font-black text-gray-950 uppercase">{scannedPermit.studentName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-700 font-semibold">
                      <span>Kelas: <strong className="text-emerald-900">{scannedPermit.studentClass}</strong></span>
                      {scannedPermit.nisn && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-gray-500">NISN: {scannedPermit.nisn}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-semibold text-gray-500 block">Orang Tua / HP:</span>
                      <p className="font-bold text-gray-900">{scannedPermit.parentName}</p>
                      <p className="font-mono text-emerald-700">{scannedPermit.parentPhone}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-semibold text-gray-500 block">Ketentuan Kembali:</span>
                      {scannedPermit.isReturning && scannedPermit.estimatedReturnTime ? (
                        <p className="font-bold text-emerald-800 font-mono">
                          Wajib Masuk Sebelum: {scannedPermit.estimatedReturnTime} WIB
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">Izin pulang / tidak kembali hari ini</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-600 uppercase block mb-1">Keperluan Keluar:</span>
                    <p className="text-xs sm:text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <strong>[{scannedPermit.reasonCategory}]</strong> {scannedPermit.reasonDetail}
                    </p>
                  </div>
                </div>

                {/* Right: Gate Actions & Proof preview */}
                <div className="space-y-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-1">Bukti Izin Orang Tua:</span>
                    {scannedPermit.hasParentProof && scannedPermit.parentProofImage ? (
                      <div
                        onClick={() =>
                          onPreviewImage(
                            scannedPermit.parentProofImage!,
                            'Bukti Perizinan Orang Tua',
                            scannedPermit.studentName
                          )
                        }
                        className="cursor-pointer rounded-xl overflow-hidden border border-emerald-300 max-h-28 bg-gray-900 flex items-center justify-center relative group"
                      >
                        <img
                          src={scannedPermit.parentProofImage}
                          alt="Bukti Chat"
                          className="max-h-28 w-full object-cover group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Lihat Bukti Foto</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center">
                        <span className="text-sm">📞</span>
                        <p className="text-[11px] font-bold text-gray-700">Izin Konfirmasi Telepon</p>
                        <p className="text-[10px] text-gray-500">Tanpa lampiran foto</p>
                      </div>
                    )}
                  </div>

                  {/* Gate Status & Buttons */}
                  <div className="space-y-2 pt-2">
                    {scannedPermit.gateCheckedOutAt ? (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Telah Check-Out Gerbang</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                          {new Date(scannedPermit.gateCheckedOutAt).toLocaleTimeString('id-ID')} WIB oleh {scannedPermit.securityGuardName}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCheckOut}
                        className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>KONFIRMASI SISWA KELUAR GERBANG</span>
                      </button>
                    )}

                    {scannedPermit.isReturning && (
                      scannedPermit.gateCheckedInAt ? (
                        <div className="p-2.5 bg-blue-100 border border-blue-300 rounded-xl text-xs text-blue-900">
                          <span className="font-bold">Siswa Sudah Kembali Masuk:</span>
                          <p className="text-[11px] font-mono">
                            {new Date(scannedPermit.gateCheckedInAt).toLocaleTimeString('id-ID')} WIB
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCheckIn}
                          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Konfirmasi Siswa Masuk Kembali</span>
                        </button>
                      )
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onViewDocument(scannedPermit)}
                        className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                      >
                        Lihat Surat
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenWhatsApp(scannedPermit)}
                        className="flex-1 py-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold"
                      >
                        WA Ortu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : scannedPermit.status === 'DITOLAK' ? (
            /* RED PASS: REJECTED */
            <div className="bg-white rounded-2xl border-2 border-rose-500 shadow-xl overflow-hidden">
              <div className="bg-rose-600 text-white p-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white text-rose-700 flex items-center justify-center font-black shadow">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-100 bg-rose-800/60 px-2 py-0.5 rounded">
                    PERINGATAN SATPAM
                  </span>
                  <h2 className="text-lg sm:text-xl font-black mt-0.5">
                    PERMOHONAN TIDAK DIBERI IZIN (DITOLAK)
                  </h2>
                  <p className="text-xs text-rose-100">
                    Siswa TIDAK DIPERKENANKAN keluar dari area sekolah!
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-xs font-bold text-rose-900">Nama Siswa: {scannedPermit.studentName} ({scannedPermit.studentClass})</p>
                  <p className="text-xs text-rose-800 mt-1">
                    <strong>Alasan Penolakan Waka:</strong> "{scannedPermit.wakaNotes || 'Tidak memenuhi kriteria perizinan keluar.'}"
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  Mohon arahkan siswa kembali ke ruang kelas atau ke ruang piket Kesiswaan.
                </p>
              </div>
            </div>
          ) : (
            /* AMBER PASS: PENDING */
            <div className="bg-white rounded-2xl border-2 border-amber-500 shadow-xl overflow-hidden">
              <div className="bg-amber-500 text-white p-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white text-amber-700 flex items-center justify-center font-black shadow">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-100 bg-amber-700/60 px-2 py-0.5 rounded">
                    BELUM TERVERIFIKASI
                  </span>
                  <h2 className="text-lg sm:text-xl font-black mt-0.5">
                    STATUS MASIH MENUNGGU PERSETUJUAN WAKA
                  </h2>
                  <p className="text-xs text-amber-100">
                    Surat izin belum disahkan oleh Waka Kesiswaan ({scannedPermit.wakaKesiswaanName}).
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-700">
                  Surat izin atas nama <strong>{scannedPermit.studentName}</strong> ({scannedPermit.studentClass}) masih berstatus antrean. Siswa harus menunggu persetujuan digital Waka Kesiswaan sebelum diizinkan keluar melewati pos satpam.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
