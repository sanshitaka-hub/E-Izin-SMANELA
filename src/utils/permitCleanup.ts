import { ExitPermit } from '../types';

export const PERMIT_MAX_AGE_DAYS = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Mendapatkan usia surat izin dalam satuan hari berdasarkan tanggal pembuatan / persetujuan
 */
export function getPermitAgeInDays(permit: ExitPermit): number {
  const referenceDateStr = permit.createdAt || permit.date;
  const permitTime = new Date(referenceDateStr).getTime();
  if (isNaN(permitTime)) {
    return 0;
  }
  const now = Date.now();
  const diffMs = now - permitTime;
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / ONE_DAY_MS);
}

/**
 * Memeriksa apakah surat izin telah berusia 10 hari atau lebih
 */
export function isPermitExpired10Days(permit: ExitPermit): boolean {
  return getPermitAgeInDays(permit) >= PERMIT_MAX_AGE_DAYS;
}

/**
 * Menghitung sisa hari sebelum surat izin dihapus secara otomatis (maksimal 10 hari)
 */
export function getDaysRemaining(permit: ExitPermit): number {
  const age = getPermitAgeInDays(permit);
  const remaining = PERMIT_MAX_AGE_DAYS - age;
  return remaining > 0 ? remaining : 0;
}

/**
 * Membersihkan surat izin yang telah melampaui batas waktu 10 hari
 */
export function cleanupOldPermits(permits: ExitPermit[]): {
  remaining: ExitPermit[];
  removedCount: number;
} {
  const remaining: ExitPermit[] = [];
  let removedCount = 0;

  for (const permit of permits) {
    if (isPermitExpired10Days(permit)) {
      removedCount++;
    } else {
      remaining.push(permit);
    }
  }

  return { remaining, removedCount };
}
