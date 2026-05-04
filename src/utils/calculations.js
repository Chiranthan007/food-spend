import {
  isToday,
  isThisWeek,
  isLastWeek,
} from "./date";

export const getBasicTotals = (expenses) => {
  let todayTotal = 0;
  let weekTotal = 0;

  expenses.forEach((e) => {
    if (isToday(e.timestamp)) todayTotal += e.amount;
    if (isThisWeek(e.timestamp)) weekTotal += e.amount;
  });

  return { todayTotal, weekTotal };
};

export const getInsightsData = (expenses) => {
  let todayTotal = 0;
  let weekTotal = 0;
  let lastWeekTotal = 0;

  let smallSpendTotal = 0;
  let smallSpendCount = 0;
  let smallSpends = [];

  const smallSpendByCategory = {};

  const dayTotals = {};
  const hourTotals = {};
  const categoryTotals = {};
  const last7Map = {};

  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // init last 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    last7Map[d.toDateString()] = 0;
  }

  expenses.forEach((e) => {
    const amount = e.amount;
    const date = new Date(e.timestamp);
    const dateStr = date.toDateString();
    const day = days[date.getDay()];
    const hour = date.getHours();
    const category = e.category || "Other";

    if (isToday(e.timestamp)) todayTotal += amount;
    if (isThisWeek(e.timestamp)) weekTotal += amount;
    if (isLastWeek(e.timestamp)) lastWeekTotal += amount;

    // 🪣 Small spends
    if (amount <= 100) {
      smallSpendTotal += amount;
      smallSpendCount++;

      smallSpends.push({
        id: e.id,
        amount: e.amount,
        note: e.note,
        category: e.category,
        timestamp: e.timestamp,
      });

      smallSpendByCategory[category] =
        (smallSpendByCategory[category] || 0) + amount;
    }

    if (isThisWeek(e.timestamp)) {
      dayTotals[day] = (dayTotals[day] || 0) + amount;
      hourTotals[hour] = (hourTotals[hour] || 0) + amount;
    }

    categoryTotals[category] =
      (categoryTotals[category] || 0) + amount;

    if (last7Map[dateStr] !== undefined) {
      last7Map[dateStr] += amount;
    }
  });

  // sort latest first
  smallSpends.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // 🔥 Top leak category
  let topLeakCategory = null;
  let topLeakAmount = 0;

  Object.entries(smallSpendByCategory).forEach(([cat, total]) => {
    if (total > topLeakAmount) {
      topLeakCategory = cat;
      topLeakAmount = total;
    }
  });

  // 📅 Start of week (Monday)
  const startOfWeek = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const daysPassed = Math.max(
    1,
    Math.ceil((now - startOfWeek) / (1000 * 60 * 60 * 24))
  );

  const burnRate = weekTotal / daysPassed;

  const difference = weekTotal - lastWeekTotal;
  const percentChange =
    lastWeekTotal > 0 ? (difference / lastWeekTotal) * 100 : 0;

  let topDay = null;
  let topDayAmount = 0;

  Object.entries(dayTotals).forEach(([d, total]) => {
    if (total > topDayAmount) {
      topDay = d;
      topDayAmount = total;
    }
  });

  let peakHour = null;
  let peakAmount = 0;

  Object.entries(hourTotals).forEach(([h, total]) => {
    if (total > peakAmount) {
      peakHour = Number(h);
      peakAmount = total;
    }
  });

  const last7Data = Object.entries(last7Map)
    .map(([dateStr, amount]) => {
      const d = new Date(dateStr);
      return {
        name: days[d.getDay()],
        amount,
      };
    })
    .reverse();

  const categoryData = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const totalSum = categoryData.reduce((s, c) => s + c.total, 0);

  return {
    todayTotal,
    weekTotal,
    lastWeekTotal,
    difference,
    percentChange,
    topDay,
    topDayAmount,
    peakHour,
    peakAmount,
    last7Data,
    categoryData,
    totalSum,
    smallSpendTotal,
    smallSpendCount,
    smallSpends,
    topLeakCategory,
    topLeakAmount,
    burnRate,
    daysPassed,
  };
};