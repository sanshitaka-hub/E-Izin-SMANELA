import QRCode from 'qrcode';
import { ExitPermit } from '../types';

export interface QRPayload {
  app: 'SMANELA_IZIN_KELUAR';
  id: string;
  name: string;
  class: string;
  status: string;
  timeOut: string;
  waka: string;
  token: string;
}

export async function generatePermitQRCode(permit: ExitPermit): Promise<string> {
  const payload: QRPayload = {
    app: 'SMANELA_IZIN_KELUAR',
    id: permit.id,
    name: permit.studentName,
    class: permit.studentClass,
    status: permit.status,
    timeOut: permit.timeOut,
    waka: permit.wakaKesiswaanName,
    token: permit.verificationToken,
  };

  const payloadString = JSON.stringify(payload);

  try {
    const dataUrl = await QRCode.toDataURL(payloadString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#1e3a8a', // SMANELA Royal Blue
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function parseQRCodeData(rawText: string): { permitId?: string; isOfficialFormat: boolean; raw: string } {
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && parsed.app === 'SMANELA_IZIN_KELUAR' && parsed.id) {
      return { permitId: parsed.id, isOfficialFormat: true, raw: rawText };
    }
  } catch {
    // If raw string starts with IZN-SMANELA
    if (rawText.includes('IZN-SMANELA-')) {
      const match = rawText.match(/IZN-SMANELA-\d+-\d+/);
      if (match) {
        return { permitId: match[0], isOfficialFormat: true, raw: rawText };
      }
    }
  }

  return { isOfficialFormat: false, raw: rawText };
}
