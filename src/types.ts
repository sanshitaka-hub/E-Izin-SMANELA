export type PermitStatus = 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK';

export type UserRole = 'SISWA' | 'GURU' | 'SATPAM';

export type ExitCategory = 
  | 'Sakit / Periksa Medis'
  | 'Keperluan Keluarga Mendesak'
  | 'Tugas / Lomba Mewakili Sekolah'
  | 'Pengurusan Berkas / Dokumen Resmi'
  | 'Lainnya';

export interface ExitPermit {
  id: string; // e.g. "IZN-SMANELA-2026-0042"
  createdAt: string; // ISO date string
  date: string; // e.g. "2026-10-24"
  timeOut: string; // e.g. "09:30"
  estimatedReturnTime?: string; // e.g. "11:30" or "" if not returning
  isReturning: boolean;

  // 1. Nama Siswa
  studentName: string;
  nisn?: string;

  // 2. Kelas
  studentClass: string;

  // 3. Nama Orang Tua
  parentName: string;

  // 4. Nomor HP Orang Tua
  parentPhone: string;

  // 5. Alasan Keluar (Keperluan Apa?)
  reasonCategory: ExitCategory;
  reasonDetail: string;

  // 6. Bukti Screenshot Perizinan dari Orang Tua (Opsional)
  hasParentProof: boolean;
  parentProofImage?: string; // Base64 data URL or sample image URL
  parentProofFileName?: string;

  // 7. Nama Waka Kesiswaan
  wakaKesiswaanName: string;
  wakaNip?: string;

  // 8. Status & Tombol Persetujuan Waka
  status: PermitStatus;
  approvedAt?: string;
  wakaNotes?: string;

  // 9. Gate / Satpam tracking
  gateCheckedOutAt?: string;
  gateCheckedInAt?: string;
  securityGuardName?: string;

  // 10. WhatsApp notification status
  whatsappSent: boolean;
  whatsappSentAt?: string;
  whatsappMessageContent?: string;

  // 11. Share ke Guru Pengajar / Wali Kelas
  sharedToTeacher?: boolean;
  sharedToTeacherAt?: string;
  targetTeacherName?: string;

  // Digital verification hash/token
  verificationToken: string;
}

export interface WakaOfficial {
  name: string;
  nip: string;
  title: string;
  signatureUrl?: string;
}

export interface PortalCredential {
  role: UserRole;
  title: string;
  subtitle: string;
  code: string;
  badge: string;
  description: string;
}
