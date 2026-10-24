import { ExitPermit, WakaOfficial, PortalCredential } from '../types';

export const DEFAULT_WAKA: WakaOfficial = {
  name: 'Drs. H. Bambang Irawan, M.Pd',
  nip: '19680512 199303 1 008',
  title: 'Waka Kesiswaan SMAN 1 Lawang',
};

export const SCHOOL_INFO = {
  name: 'SMA NEGERI 1 LAWANG',
  motto: 'BAKTIKU HARAPANMU',
  address: 'Jl. Pramuka No. 152, Kalirejo, Kec. Lawang, Kab. Malang, Jawa Timur 65216',
  phone: '(0341) 426187',
  email: 'info@sman1lawang.sch.id',
  website: 'https://sman1lawang.sch.id',
  headmaster: 'Dr. H. Amat, M.Pd',
  nipHeadmaster: '19650314 199003 1 012',
};

export const SMANELA_CLASSES = [
  'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10',
  'XI-1 (Fase F)', 'XI-2 (Fase F)', 'XI-3 (Fase F)', 'XI-4 (Fase F)', 'XI-5 (Fase F)', 'XI-6 (Fase F)', 'XI-7 (Fase F)', 'XI-8 (Fase F)',
  'XII MIPA 1', 'XII MIPA 2', 'XII MIPA 3', 'XII MIPA 4', 'XII MIPA 5',
  'XII IPS 1', 'XII IPS 2', 'XII IPS 3', 'XII IPS 4'
];

export const PORTAL_CREDENTIALS: Record<'SISWA' | 'GURU' | 'SATPAM', PortalCredential> = {
  SISWA: {
    role: 'SISWA',
    title: 'Portal Siswa / Murid',
    subtitle: 'Pengajuan Surat Izin & Pantau QR Pass Mandiri',
    code: 'SISWA-2026',
    badge: 'Siswa SMANELA',
    description: 'Akses khusus siswa untuk mengajukan izin keluar sekolah, mengisi data manual, serta memantau status izin.',
  },
  GURU: {
    role: 'GURU',
    title: 'Portal Guru & Waka Kesiswaan',
    subtitle: 'Meja Persetujuan Otoritas & Gateway WhatsApp',
    code: 'GURUHEBAT2024',
    badge: 'Waka Kesiswaan',
    description: 'Akses berwenang untuk meninjau permohonan, tombol Diberi Izin / Tidak Diberi Izin, dan notifikasi pesan WhatsApp orang tua.',
  },
  SATPAM: {
    role: 'SATPAM',
    title: 'Portal Pos Satpam & Gerbang',
    subtitle: 'Pemindai Kamera Live QR & Catat Check-Out',
    code: 'SATPAMSMANELA2026',
    badge: 'Keamanan Gerbang',
    description: 'Akses pos jaga keamanan utama untuk memindai QR Code siswa, memvalidasi surat izin sah, dan mencatat jam lintasan gerbang.',
  },
};

// Sample base64 placeholder for parent chat proof
export const SAMPLE_CHAT_PROOF_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230b141a"/><rect y="0" width="600" height="60" fill="%231f2c34"/><circle cx="40" cy="30" r="18" fill="%2300a884"/><text x="40" y="36" font-size="16" fill="white" font-weight="bold" text-anchor="middle">I</text><text x="75" y="30" font-size="16" fill="%23e9edef" font-family="sans-serif" font-weight="600">Ibu Siti Nurhaliza (Mama)</text><text x="75" y="48" font-size="12" fill="%238696a0" font-family="sans-serif">Online</text><rect x="30" y="90" rx="10" ry="10" width="460" height="130" fill="%23005c4b"/><text x="50" y="120" font-size="14" fill="%23e9edef" font-family="sans-serif">Selamat pagi Bapak/Ibu Petugas SMAN 1 Lawang,</text><text x="50" y="145" font-size="14" fill="%23e9edef" font-family="sans-serif">Saya orang tua dari Muhammad Alif Pratama kelas XI-2.</text><text x="50" y="170" font-size="14" fill="%23e9edef" font-family="sans-serif">Mohon izin anak saya keluar sekolah pukul 09.30 WIB</text><text x="50" y="195" font-size="14" fill="%23e9edef" font-family="sans-serif">karena ada jadwal pemeriksaan gigi di Puskesmas Lawang.</text><text x="440" y="210" font-size="11" fill="%238696a0" font-family="sans-serif">08.15 ✓✓</text><rect x="30" y="240" rx="10" ry="10" width="380" height="70" fill="%23005c4b"/><text x="50" y="270" font-size="14" fill="%23e9edef" font-family="sans-serif">Nanti setelah selesai periksa akan segera</text><text x="50" y="295" font-size="14" fill="%23e9edef" font-family="sans-serif">kembali ke sekolah sebelum jam istirahat kedua.</text><text x="360" y="300" font-size="11" fill="%238696a0" font-family="sans-serif">08.16 ✓✓</text></svg>`;

export const SAMPLE_CHAT_PROOF_FAMILY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230b141a"/><rect y="0" width="600" height="60" fill="%231f2c34"/><circle cx="40" cy="30" r="18" fill="%2300a884"/><text x="40" y="36" font-size="16" fill="white" font-weight="bold" text-anchor="middle">A</text><text x="75" y="30" font-size="16" fill="%23e9edef" font-family="sans-serif" font-weight="600">Ayah Joko Susilo</text><text x="75" y="48" font-size="12" fill="%238696a0" font-family="sans-serif">Online</text><rect x="30" y="90" rx="10" ry="10" width="480" height="120" fill="%23005c4b"/><text x="50" y="125" font-size="14" fill="%23e9edef" font-family="sans-serif">Assalamualaikum wr. wb. Bapak Waka Kesiswaan SMANELA,</text><text x="50" y="150" font-size="14" fill="%23e9edef" font-family="sans-serif">Saya orang tua Nabila Putri Kirana (XII MIPA 3) meminta izin</text><text x="50" y="175" font-size="14" fill="%23e9edef" font-family="sans-serif">menjemput anak saya karena urusan keluarga mendesak.</text><text x="460" y="198" font-size="11" fill="%238696a0" font-family="sans-serif">09.05 ✓✓</text></svg>`;

export const INITIAL_PERMITS: ExitPermit[] = [
  {
    id: 'IZN-SMANELA-2026-0089',
    createdAt: '2026-10-24T08:15:00.000Z',
    date: '2026-10-24',
    timeOut: '09:30',
    estimatedReturnTime: '12:00',
    isReturning: true,
    studentName: 'Muhammad Alif Pratama',
    nisn: '0078912345',
    studentClass: 'XI-2',
    parentName: 'Siti Nurhaliza',
    parentPhone: '081234567890',
    reasonCategory: 'Sakit / Periksa Medis',
    reasonDetail: 'Pemeriksaan lanjutan gigi bengkak dan kontrol di Puskesmas Lawang dengan didampingi bibi.',
    hasParentProof: true,
    parentProofImage: SAMPLE_CHAT_PROOF_SVG,
    parentProofFileName: 'bukti_chat_izin_ibu_siti.png',
    wakaKesiswaanName: 'Drs. H. Bambang Irawan, M.Pd',
    wakaNip: '19680512 199303 1 008',
    status: 'MENUNGGU',
    wakaNotes: '',
    whatsappSent: false,
    verificationToken: 'v-smanela-0089-a9f23',
  },
  {
    id: 'IZN-SMANELA-2026-0088',
    createdAt: '2026-10-24T07:45:00.000Z',
    date: '2026-10-24',
    timeOut: '08:30',
    estimatedReturnTime: '11:00',
    isReturning: true,
    studentName: 'Nabila Putri Kirana',
    nisn: '0067823411',
    studentClass: 'XII MIPA 3',
    parentName: 'Joko Susilo',
    parentPhone: '081398765432',
    reasonCategory: 'Keperluan Keluarga Mendesak',
    reasonDetail: 'Menjemput adik di SD Lawang dan urusan keluarga darurat.',
    hasParentProof: false, // OPSI TANPA BUKTI FOTO (KONFIRMASI LISAN)
    wakaKesiswaanName: 'Drs. H. Bambang Irawan, M.Pd',
    wakaNip: '19680512 199303 1 008',
    status: 'DISETUJUI',
    approvedAt: '2026-10-24T08:00:00.000Z',
    wakaNotes: 'Diberikan izin keluar. Konfirmasi telepon dari orang tua telah diterima. Wajib kembali tepat waktu.',
    gateCheckedOutAt: '2026-10-24T08:32:00.000Z',
    securityGuardName: 'Pak Sugiono (Satpam Pos 1)',
    whatsappSent: true,
    whatsappSentAt: '2026-10-24T08:01:00.000Z',
    verificationToken: 'v-smanela-0088-b4c71',
  },
  {
    id: 'IZN-SMANELA-2026-0087',
    createdAt: '2026-10-24T07:15:00.000Z',
    date: '2026-10-24',
    timeOut: '08:00',
    estimatedReturnTime: '',
    isReturning: false,
    studentName: 'Rendra Bagus Wicaksono',
    nisn: '0081239876',
    studentClass: 'X-4',
    parentName: 'Kusuma Hendra',
    parentPhone: '085712349988',
    reasonCategory: 'Lainnya',
    reasonDetail: 'Mau membeli perlengkapan tugas kelompok di luar sekolah.',
    hasParentProof: false, // OPSI TANPA BUKTI FOTO
    wakaKesiswaanName: 'Drs. H. Bambang Irawan, M.Pd',
    wakaNip: '19680512 199303 1 008',
    status: 'DITOLAK',
    approvedAt: '2026-10-24T07:35:00.000Z',
    wakaNotes: 'Ditolak: Pembelian perlengkapan tugas kelompok harus dilakukan di luar jam belajar atau melalui koperasi sekolah.',
    whatsappSent: true,
    whatsappSentAt: '2026-10-24T07:36:00.000Z',
    verificationToken: 'v-smanela-0087-f109a',
  }
];
