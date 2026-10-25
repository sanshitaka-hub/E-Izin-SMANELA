/**
 * Safe clipboard copy utility with legacy textarea fallback
 * Prevents "Permission denied" errors in iframes and restricted browser contexts
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern Clipboard API if supported and permitted
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Modern API blocked or permission denied; fall through to legacy textarea fallback
    }
  }

  // 2. Fallback using temporary hidden textarea and execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
