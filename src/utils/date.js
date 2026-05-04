// 📅 Get start of current week (Monday)
export const getStartOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 📅 Get start of last week
export const getStartOfLastWeek = () => {
  const start = getStartOfWeek();
  const d = new Date(start);
  d.setDate(d.getDate() - 7);
  return d;
};

// 📆 Check if date is today
export const isToday = (date) => {
  const now = new Date();
  const d = new Date(date);
  return d.toDateString() === now.toDateString();
};

// 📆 Check if date is yesterday
export const isYesterday = (date) => {
  const now = new Date();
  const y = new Date();
  y.setDate(now.getDate() - 1);

  const d = new Date(date);
  return d.toDateString() === y.toDateString();
};

// 📊 Check if in this week
export const isThisWeek = (date) => {
  const start = getStartOfWeek();
  return new Date(date) >= start;
};

// 📊 Check if in last week
export const isLastWeek = (date) => {
  const start = getStartOfWeek();
  const lastStart = getStartOfLastWeek();
  const d = new Date(date);
  return d >= lastStart && d < start;
};