export function isLowEndDevice() {
  try {
    // navigator.deviceMemory may be undefined in some browsers; default to 4
    const deviceMemory = (typeof navigator !== "undefined" && (navigator as any).deviceMemory) || 4;
    const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
    return Boolean(isMobile) || deviceMemory <= 2;
  } catch {
    return false;
  }
}