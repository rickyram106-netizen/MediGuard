export const todayStr = () => new Date().toISOString().slice(0, 10);

export const dateLabel = (dateStr: string) => {
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const timeToMinutes = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1]), mn = parseInt(m[2]);
  const p = m[3].toUpperCase();
  if (p === 'PM' && h !== 12) h += 12;
  if (p === 'AM' && h === 12) h = 0;
  return h * 60 + mn;
};

export const nowMinutes = () => {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
};

export const formatTime = (t: string) => {
  if (!t) return '';
  if (t.includes('AM') || t.includes('PM')) return t;
  const [h, m] = t.split(':').map(Number);
  const am = h < 12;
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
};

export const getGreeting = (name?: string) => {
  const h = new Date().getHours();
  let part = 'Good Evening';
  if (h < 12) part = 'Good Morning';
  else if (h < 17) part = 'Good Afternoon';
  return `${part}${name ? `, ${name} 👋` : ' 👋'}`;
};
