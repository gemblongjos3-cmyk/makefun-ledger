export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

export function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function dateFmt(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
  }).format(date) + ' UTC';
}

export function timeLeft(iso) {
  const remaining = new Date(iso).getTime() - Date.now();
  if (!Number.isFinite(remaining)) return '—';
  if (remaining <= 0) return 'ended';
  const minutes = Math.floor(remaining / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days) return `${days}d ${hours}h left`;
  if (hours) return `${hours}h ${minutes % 60}m left`;
  return `${Math.max(1, minutes)}m left`;
}

export function isOpen(b) {
  return new Date(b?.deadline).getTime() > Date.now();
}

export function shortWallet(addr) {
  const value = String(addr ?? '');
  return value.length > 8 ? `${value.slice(0, 4)}…${value.slice(-4)}` : value;
}
