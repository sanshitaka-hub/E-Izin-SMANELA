import { ExitPermit } from '../types';
import { SCHOOL_INFO } from '../data/mockData';

export function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62') && cleaned.length > 8) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppMessage(permit: ExitPermit): string {
  const isApproved = permit.status === 'DISETUJUI';
  const isRejected = permit.status === 'DITOLAK';

  const statusEmoji = isApproved ? '✅ *DISETUJUI / DIBERI IZIN*' : isRejected ? '❌ *TIDAK DIBERI IZIN (DITOLAK)*' : '⏳ *DALAM PROSES VERIFIKASI*';

  const lines = [
    `*PEMBERITAHUAN RESMI PERIZINAN KELUAR SEKOLAH*`,
    `*${SCHOOL_INFO.name}*`,
    `_${SCHOOL_INFO.address}_`,
    `───────────────────────`,
    `Yth. Bapak/Ibu: *${permit.parentName}* (Orang Tua / Wali Siswa)`,
    ``,
    `Berikut adalah laporan status perizinan keluar sekolah putra/putri Anda:`,
    `• *Nama Siswa*: ${permit.studentName}`,
    `• *Kelas*: ${permit.studentClass}`,
    `• *Alasan Keluar*: ${permit.reasonCategory} - ${permit.reasonDetail}`,
    `• *Rencana Jam Keluar*: ${permit.timeOut} WIB`,
    permit.isReturning && permit.estimatedReturnTime
      ? `• *Estimasi Jam Kembali*: ${permit.estimatedReturnTime} WIB`
      : `• *Status Kembali*: Tidak kembali ke sekolah hari ini`,
    ``,
    `───────────────────────`,
    `*STATUS PERIZINAN*: ${statusEmoji}`,
    `• *Waka Kesiswaan*: ${permit.wakaKesiswaanName}`,
    permit.approvedAt
      ? `• *Waktu Keputusan*: ${new Date(permit.approvedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
      : '',
    permit.wakaNotes ? `• *Catatan Waka*: "${permit.wakaNotes}"` : '',
    permit.gateCheckedOutAt
      ? `• *Status Gerbang*: Telah melewati pos satpam pada pukul ${new Date(permit.gateCheckedOutAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
      : '',
    ``,
    `───────────────────────`,
    `Nomor Izin: *${permit.id}*`,
    `Verifikasi Digital QR: Keaslian surat izin ini telah tersertifikasi sistem E-Izin SMAN 1 Lawang.`,
    ``,
    `_Pesan otomatis dikirim melalui Sistem Informasi E-Perizinan Siswa SMAN 1 Lawang._`
  ];

  return lines.filter(Boolean).join('\n');
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const sanitized = sanitizePhoneNumber(phone);
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export function generateTeacherShareMessage(permit: ExitPermit, teacherName?: string): string {
  const lines = [
    `*PEMBERITAHUAN DISPENSASI IZIN KELUAR SISWA*`,
    `*${SCHOOL_INFO.name}*`,
    `───────────────────────`,
    `Yth. Bapak/Ibu ${teacherName ? `*${teacherName}*` : 'Guru Pengajar / Wali Kelas'} (Kelas ${permit.studentClass})`,
    ``,
    `Disampaikan bahwa Waka Kesiswaan SMAN 1 Lawang telah memberikan *IZIN RESMI* keluar lingkungan sekolah kepada siswa berikut:`,
    ``,
    `• *Nama Siswa*: ${permit.studentName}`,
    `• *Kelas*: ${permit.studentClass}`,
    `• *Jadwal Keluar*: Pukul ${permit.timeOut} WIB`,
    permit.isReturning && permit.estimatedReturnTime
      ? `• *Estimasi Jam Kembali*: Pukul ${permit.estimatedReturnTime} WIB`
      : `• *Status Kembali*: Izin tidak kembali ke sekolah hari ini`,
    `• *Alasan/Keperluan*: ${permit.reasonCategory} - ${permit.reasonDetail}`,
    permit.wakaNotes ? `• *Catatan Waka*: "${permit.wakaNotes}"` : '',
    ``,
    `• *Otoritas Pengesah*: ${permit.wakaKesiswaanName} (Waka Kesiswaan)`,
    `• *No. Registrasi Izin*: ${permit.id}`,
    ``,
    `───────────────────────`,
    `_Mohon dicatat dalam presensi jam pelajaran yang bersangkutan. Terima kasih._`
  ];

  return lines.filter(Boolean).join('\n');
}

export function getGeneralWhatsAppShareUrl(message: string, phone?: string): string {
  if (phone && phone.trim()) {
    const sanitized = sanitizePhoneNumber(phone);
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

